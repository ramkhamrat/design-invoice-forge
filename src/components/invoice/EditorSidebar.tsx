
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Invoice, InvoiceData, InvoiceElement } from "@/types";
import ToolbarPanel from "@/components/invoice/ToolbarPanel";
import DataPanel from "@/components/invoice/DataPanel";

interface EditorSidebarProps {
  isPreviewMode: boolean;
  isPanelCollapsed: boolean;
  togglePanel: () => void;
  invoice: Invoice;
  selectedElement: InvoiceElement | null;
  onAddElement: (element: InvoiceElement) => void;
  onSave: () => void;
  onPrint: () => void;
  onDeleteElement: (id: string) => void;
  onDataChange: (data: InvoiceData) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  isPreviewMode,
  isPanelCollapsed,
  togglePanel,
  invoice,
  selectedElement,
  onAddElement,
  onSave,
  onPrint,
  onDeleteElement,
  onDataChange,
}) => {
  return (
    <>
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
              onAddElement={onAddElement}
              onSave={onSave}
              onPrint={onPrint}
              selectedElement={selectedElement}
              onDeleteElement={onDeleteElement}
            />

            <DataPanel data={invoice.data} onDataChange={onDataChange} />
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
    </>
  );
};

export default EditorSidebar;
