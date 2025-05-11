import React, { useState, useRef } from "react";
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
  const startPosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // Get dimensions from selected paper size
  const { width, height } = PAPER_SIZES[paperSize] || PAPER_SIZES.A4;

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

  return (
    <div
      ref={canvasRef}
      className="invoice-canvas relative bg-white border rounded-md shadow-sm overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }} // A4 size at 96dpi
      onClick={handleCanvasClick}
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`invoice-element ${selectedElementId === element.id ? 'selected' : ''} ${isPreview ? 'pointer-events-none' : ''}`}
          style={getElementStyle(element)}
          drag={!isPreview}
          dragMomentum={false}
          onDragStart={(e) => {
            e.stopPropagation();
            onSelectElement(element.id);
          }}
          onDrag={(e, info) => {
            const canvasBounds = canvasRef.current?.getBoundingClientRect();
            if (!canvasBounds) return;

            const x = Math.max(0, Math.min(info.point.x - canvasBounds.left, canvasBounds.width - (element.position.width || 0)));
            const y = Math.max(0, Math.min(info.point.y - canvasBounds.top, canvasBounds.height - (element.position.height || 0)));
            
            onElementMove(element.id, x, y);
          }}
          onClick={(e) => handleElementClick(e, element.id)}
        >
          {renderContent(element)}

          {/* Resize handles */}
          {!isPreview && selectedElementId === element.id && (
            <>
              <div
                className="element-control-handle resize-handle-nw"
                onMouseDown={(e) => handleResizeStart(e, element.id, "nw")}
              />
              <div
                className="element-control-handle resize-handle-ne"
                onMouseDown={(e) => handleResizeStart(e, element.id, "ne")}
              />
              <div
                className="element-control-handle resize-handle-sw"
                onMouseDown={(e) => handleResizeStart(e, element.id, "sw")}
              />
              <div
                className="element-control-handle resize-handle-se"
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
