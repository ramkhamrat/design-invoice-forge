
import React from "react";
import { InvoiceData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { calculateTotals } from "@/lib/utils";
import InvoiceItemsList from "./InvoiceItemsList";

interface InvoiceTabProps {
  data: InvoiceData;
  onDataChange: (section: keyof InvoiceData, field: string, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const InvoiceTab: React.FC<InvoiceTabProps> = ({ 
  data, 
  onDataChange, 
  onAddItem,
  onRemoveItem 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            value={data.invoiceNumber}
            onChange={(e) => onDataChange("invoiceNumber", "", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onDataChange("title", "", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => onDataChange("date", "", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={data.dueDate}
            onChange={(e) => onDataChange("dueDate", "", e.target.value)}
          />
        </div>
      </div>

      <InvoiceItemsList 
        items={data.items}
        onItemChange={onDataChange}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      />

      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={data.notes || ""}
            onChange={(e) => onDataChange("notes", "", e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="terms">Terms</Label>
          <Textarea
            id="terms"
            value={data.terms || ""}
            onChange={(e) => onDataChange("terms", "", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-2 pt-4 border-t">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${data.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (10%):</span>
          <span>${data.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${data.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTab;
