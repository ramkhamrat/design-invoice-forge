
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PaperSizeKey, PAPER_SIZES } from "@/lib/invoice-utils";

interface PaperSizeSelectorProps {
  currentSize: PaperSizeKey;
  onChange: (size: PaperSizeKey) => void;
}

const PaperSizeSelector: React.FC<PaperSizeSelectorProps> = ({ currentSize, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium">Paper Size:</label>
      <Select value={currentSize} onValueChange={(value) => onChange(value as PaperSizeKey)}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="A4">A4</SelectItem>
          <SelectItem value="A5">A5</SelectItem>
          <SelectItem value="SLIP">TM220B Slip</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaperSizeSelector;
