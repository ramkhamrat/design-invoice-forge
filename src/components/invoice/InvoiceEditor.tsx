
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Invoice, InvoiceElement, InvoiceData } from "@/types";
import InvoiceCanvas from "@/components/invoice/InvoiceCanvas";
import ToolbarPanel from "@/components/invoice/ToolbarPanel";
import ElementEditor from "@/components/invoice/ElementEditor";
import DataPanel from "@/components/invoice/DataPanel";
import LoadingIndicator from "@/components/invoice/LoadingIndicator";
import { PaperSizeKey } from "@/lib/invoice-utils";
import { toast } from "sonner";
import { invoiceApi } from "@/services/api";
import EditorHeader from "./EditorHeader";
import EditorSidebar from "./EditorSidebar";

interface InvoiceEditorProps {
  initialInvoice: Invoice;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ initialInvoice }) => {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoice);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isElementEditorOpen, setIsElementEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Open element editor when an element is selected
    if (selectedElementId) {
      setIsElementEditorOpen(true);
    } else {
      setIsElementEditorOpen(false);
    }
  }, [selectedElementId]);

  const selectedElement = invoice.elements.find(
    (el) => el.id === selectedElementId
  );

  const handlePaperSizeChange = (size: PaperSizeKey) => {
    setInvoice((prev) => ({
      ...prev,
      paperSize: size,
    }));
  };

  const handleAddElement = (element: InvoiceElement) => {
    setInvoice((prev) => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
    setSelectedElementId(element.id);
  };

  const handleElementMove = (id: string, x: number, y: number) => {
    setInvoice((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id
          ? {
              ...el,
              position: {
                ...el.position,
                x,
                y,
              },
            }
          : el
      ),
    }));
  };

  const handleElementResize = (id: string, width: number, height: number) => {
    setInvoice((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === id
          ? {
              ...el,
              position: {
                ...el.position,
                width,
                height,
              },
            }
          : el
      ),
    }));
  };

  const handleElementUpdate = (updatedElement: InvoiceElement) => {
    setInvoice((prev) => ({
      ...prev,
      elements: prev.elements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      ),
    }));
  };

  const handleDeleteElement = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
    setSelectedElementId(null);
  };

  const handleDataChange = (newData: InvoiceData) => {
    setInvoice((prev) => ({
      ...prev,
      data: newData,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (invoice.id) {
        await invoiceApi.updateInvoice(invoice);
      } else {
        const newInvoice = await invoiceApi.createInvoice(invoice);
        setInvoice(newInvoice);
      }
      toast.success("Invoice saved successfully");
    } catch (error) {
      console.error("Failed to save invoice:", error);
      toast.error("Failed to save invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    setIsPreviewMode(true);
    setTimeout(() => {
      window.print();
      setIsPreviewMode(false);
    }, 300);
  };

  const togglePanel = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  if (isLoading) {
    return <LoadingIndicator message="Processing invoice..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <EditorHeader 
        isPreviewMode={isPreviewMode}
        setIsPreviewMode={setIsPreviewMode}
        paperSize={invoice.paperSize as PaperSizeKey || "A4"}
        onPaperSizeChange={handlePaperSizeChange}
        onPrint={handlePrint}
      />

      <div className="flex-1 flex overflow-hidden">
        <EditorSidebar 
          isPreviewMode={isPreviewMode}
          isPanelCollapsed={isPanelCollapsed}
          togglePanel={togglePanel}
          invoice={invoice}
          selectedElement={selectedElement}
          onAddElement={handleAddElement}
          onSave={handleSave}
          onPrint={handlePrint}
          onDeleteElement={handleDeleteElement}
          onDataChange={handleDataChange}
        />

        {/* Canvas Container */}
        <div 
          className="flex-1 overflow-auto flex items-start justify-center p-8 bg-gray-100"
          ref={canvasRef}
        >
          <div className={`${isPreviewMode ? '' : 'shadow-xl'} print-container`}>
            <InvoiceCanvas
              elements={invoice.elements}
              data={invoice.data}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onElementMove={handleElementMove}
              onElementResize={handleElementResize}
              isPreview={isPreviewMode}
              paperSize={invoice.paperSize as PaperSizeKey || "A4"}
            />
          </div>
        </div>

        {/* Element Editor Panel */}
        <AnimatePresence>
          {isElementEditorOpen && selectedElement && !isPreviewMode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "350px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[350px] bg-gray-50 border-l p-4 overflow-y-auto no-print"
            >
              <ElementEditor
                element={selectedElement}
                onUpdate={handleElementUpdate}
                onClose={() => setSelectedElementId(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InvoiceEditor;
