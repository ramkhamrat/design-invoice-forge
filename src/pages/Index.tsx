import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Invoice, InvoiceElement, InvoiceData } from "@/types";
import InvoiceCanvas from "@/components/invoice/InvoiceCanvas";
import ToolbarPanel from "@/components/invoice/ToolbarPanel";
import ElementEditor from "@/components/invoice/ElementEditor";
import DataPanel from "@/components/invoice/DataPanel";
import PaperSizeSelector from "@/components/invoice/PaperSizeSelector";
import { invoiceApi } from "@/services/api";
import { toast } from "sonner";
import { PaperSizeKey } from "@/lib/invoice-utils";

// Default invoice data
const defaultInvoice: Invoice = {
  name: "New Invoice",
  elements: [],
  paperSize: "A4",
  data: {
    title: "Invoice",
    customer: {
      name: "Client Name",
      email: "client@example.com",
      address: "123 Client Street, City, Country",
      phone: "",
    },
    company: {
      name: "Your Company",
      email: "company@example.com",
      address: "456 Business Avenue, City, Country",
      phone: "+1 (555) 123-4567",
      logo: "", 
    },
    items: [
      {
        description: "Service Description",
        quantity: 1,
        price: 100,
        amount: 100,
      },
    ],
    subtotal: 100,
    tax: 10,
    total: 110,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "Thank you for your business!",
    terms: "Payment due within 14 days of receipt.",
    status: "draft",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  },
};

const Index = () => {
  const [invoice, setInvoice] = useState<Invoice>(defaultInvoice);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isElementEditorOpen, setIsElementEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load demo invoice
    const loadInitialInvoice = async () => {
      try {
        const invoices = await invoiceApi.getInvoices();
        if (invoices.length > 0) {
          setInvoice(invoices[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load invoice:", error);
        setIsLoading(false);
      }
    };

    loadInitialInvoice();
  }, []);

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-invoice-accent mx-auto mb-4"></div>
          <p className="text-invoice-text-dark">Loading invoice template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b shadow-sm py-4 px-6 flex justify-between items-center no-print">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-invoice-text-dark">
            Invoice Builder
          </h1>
          <div className="ml-6 flex items-center gap-2">
            <button
              className={`px-4 py-1 text-sm rounded-md transition ${
                !isPreviewMode
                  ? "bg-invoice-accent text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setIsPreviewMode(false)}
            >
              Edit
            </button>
            <button
              className={`px-4 py-1 text-sm rounded-md transition ${
                isPreviewMode
                  ? "bg-invoice-accent text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setIsPreviewMode(true)}
            >
              Preview
            </button>
          </div>
          
          {/* Add paper size selector */}
          <div className="ml-6">
            <PaperSizeSelector 
              currentSize={invoice.paperSize as PaperSizeKey || "A4"} 
              onChange={handlePaperSizeChange} 
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-invoice-accent text-white rounded-md hover:bg-invoice-accent-hover transition"
          >
            Print / Export PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <AnimatePresence>
          {!isPreviewMode && !isPanelCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "350px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[350px] bg-gray-50 border-r p-4 flex flex-col gap-4 overflow-y-auto no-print"
            >
              <ToolbarPanel
                onAddElement={handleAddElement}
                onSave={handleSave}
                onPrint={handlePrint}
                selectedElement={selectedElement}
                onDeleteElement={handleDeleteElement}
              />

              <DataPanel data={invoice.data} onDataChange={handleDataChange} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel Collapse Button */}
        {!isPreviewMode && (
          <button
            onClick={togglePanel}
            className="absolute left-[350px] top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-r-md p-2 shadow-sm z-10 no-print"
            style={{ left: isPanelCollapsed ? "0" : "350px" }}
          >
            {isPanelCollapsed ? ">" : "<"}
          </button>
        )}

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

export default Index;
