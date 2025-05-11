
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { InvoiceElement, InvoiceData } from "@/types";
import { getElementStyle, bindFieldVariable } from "@/lib/utils";
import { PAPER_SIZES, PaperSizeKey } from "@/lib/invoice-utils";

interface InvoiceCanvasProps {
  elements: InvoiceElement[];
  data: InvoiceData;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onElementMove: (id: string, x: number, y: number) => void;
  onElementResize: (id: string, width: number, height: number) => void;
  isPreview?: boolean;
  paperSize?: PaperSizeKey;
}

const InvoiceCanvas: React.FC<InvoiceCanvasProps> = ({
  elements,
  data,
  selectedElementId,
  onSelectElement,
  onElementMove,
  onElementResize,
  isPreview = false,
  paperSize = "A4",
}) => {
  const [activeResizer, setActiveResizer] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const elementRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const [canvasBounds, setCanvasBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });

  // Get dimensions from selected paper size
  const { width, height } = PAPER_SIZES[paperSize] || PAPER_SIZES.A4;

  // Update canvas bounds when canvas or window size changes
  useEffect(() => {
    const updateCanvasBounds = () => {
      if (canvasRef.current) {
        const bounds = canvasRef.current.getBoundingClientRect();
        setCanvasBounds({
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height
        });
      }
    };

    updateCanvasBounds();
    window.addEventListener('resize', updateCanvasBounds);
    
    return () => {
      window.removeEventListener('resize', updateCanvasBounds);
    };
  }, [paperSize]);

  const handleElementClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onSelectElement(id);
  };

  const handleResizeStart = (
    e: React.MouseEvent,
    id: string,
    handle: string
  ) => {
    e.stopPropagation();
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    setActiveResizer(handle);
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.position.width || 100,
      height: element.position.height || 30,
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      let newWidth = startPosRef.current.width;
      let newHeight = startPosRef.current.height;

      switch (handle) {
        case "nw":
          newWidth = Math.max(20, startPosRef.current.width - dx);
          newHeight = Math.max(20, startPosRef.current.height - dy);
          break;
        case "ne":
          newWidth = Math.max(20, startPosRef.current.width + dx);
          newHeight = Math.max(20, startPosRef.current.height - dy);
          break;
        case "sw":
          newWidth = Math.max(20, startPosRef.current.width - dx);
          newHeight = Math.max(20, startPosRef.current.height + dy);
          break;
        case "se":
          newWidth = Math.max(20, startPosRef.current.width + dx);
          newHeight = Math.max(20, startPosRef.current.height + dy);
          break;
      }

      onElementResize(id, newWidth, newHeight);
    };

    const onMouseUp = () => {
      setActiveResizer(null);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const renderContent = (element: InvoiceElement) => {
    let content = element.content;
    
    if (element.fieldVariable) {
      content = bindFieldVariable(content, data);
    }

    switch (element.type) {
      case "text":
        return (
          <div 
            style={{ 
              whiteSpace: 'pre-line',
              width: '100%', 
              height: '100%',
              overflow: 'hidden'
            }}
          >
            {typeof content === 'string' ? content : ''}
          </div>
        );
      case "image":
        return <img src={typeof content === 'string' ? content : ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
      default:
        return null;
    }
  };

  const handleCanvasClick = () => {
    if (!isPreview) {
      onSelectElement(null);
    }
  };

  // Helper to get element initial x/y position for drag constraints
  const getElementInitialPosition = (element: InvoiceElement) => {
    return {
      x: element.position.x,
      y: element.position.y
    };
  };

  // Custom drag handler to ensure precise positioning
  const handleDragEnd = (e: MouseEvent, info: any, element: InvoiceElement) => {
    if (!canvasRef.current) return;

    // Calculate new position relative to canvas
    const newX = Math.max(0, Math.min(info.point.x - canvasBounds.left, canvasBounds.width - (element.position.width || 0)));
    const newY = Math.max(0, Math.min(info.point.y - canvasBounds.top, canvasBounds.height - (element.position.height || 0)));
    
    onElementMove(element.id, newX, newY);
  };

  return (
    <div
      ref={canvasRef}
      className="invoice-canvas relative bg-white border rounded-md shadow-sm overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }} 
      onClick={handleCanvasClick}
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`invoice-element absolute ${selectedElementId === element.id ? 'selected' : ''} ${isPreview ? 'pointer-events-none' : ''}`}
          style={getElementStyle(element)}
          ref={(el) => {
            if (el) elementRefs.current.set(element.id, el);
          }}
          initial={false}
          drag={!isPreview}
          dragConstraints={canvasRef}
          dragMomentum={false}
          dragElastic={0}
          onDragStart={(e) => {
            e.stopPropagation();
            onSelectElement(element.id);
          }}
          onDragEnd={(e, info) => handleDragEnd(e as unknown as MouseEvent, info, element)}
          onClick={(e) => handleElementClick(e, element.id)}
        >
          {renderContent(element)}

          {/* Resize handles */}
          {!isPreview && selectedElementId === element.id && (
            <>
              <div
                className="element-control-handle resize-handle-nw absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize"
                onMouseDown={(e) => handleResizeStart(e, element.id, "nw")}
              />
              <div
                className="element-control-handle resize-handle-ne absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full translate-x-1/2 -translate-y-1/2 cursor-nesw-resize"
                onMouseDown={(e) => handleResizeStart(e, element.id, "ne")}
              />
              <div
                className="element-control-handle resize-handle-sw absolute bottom-0 left-0 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 translate-y-1/2 cursor-nesw-resize"
                onMouseDown={(e) => handleResizeStart(e, element.id, "sw")}
              />
              <div
                className="element-control-handle resize-handle-se absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full translate-x-1/2 translate-y-1/2 cursor-nwse-resize"
                onMouseDown={(e) => handleResizeStart(e, element.id, "se")}
              />
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default InvoiceCanvas;
