
import React from "react";
import PaperSizeSelector from "@/components/invoice/PaperSizeSelector";
import { PaperSizeKey } from "@/lib/invoice-utils";

interface EditorHeaderProps {
  isPreviewMode: boolean;
  setIsPreviewMode: (isPreview: boolean) => void;
  paperSize: PaperSizeKey;
  onPaperSizeChange: (size: PaperSizeKey) => void;
  onPrint: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  isPreviewMode,
  setIsPreviewMode,
  paperSize,
  onPaperSizeChange,
  onPrint,
}) => {
  return (
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
        
        {/* Paper size selector */}
        <div className="ml-6">
          <PaperSizeSelector 
            currentSize={paperSize} 
            onChange={onPaperSizeChange} 
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onPrint}
          className="px-4 py-2 bg-invoice-accent text-white rounded-md hover:bg-invoice-accent-hover transition"
        >
          Print / Export PDF
        </button>
      </div>
    </header>
  );
};

export default EditorHeader;
