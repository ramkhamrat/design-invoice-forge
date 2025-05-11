
import React from "react";
import { InvoiceData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvoiceItemsListProps {
  items: InvoiceData["items"];
  onItemChange: (section: keyof InvoiceData, field: string, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

const InvoiceItemsList: React.FC<InvoiceItemsListProps> = ({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <Label>Items</Label>
        <Button variant="outline" size="sm" onClick={onAddItem}>
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border p-3 rounded-md relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => onRemoveItem(index)}
            >
              ×
            </Button>

            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor={`item-${index}-desc`}>Description</Label>
                <Input
                  id={`item-${index}-desc`}
                  value={item.description}
                  onChange={(e) =>
                    onItemChange("items", `${index}.description`, e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label htmlFor={`item-${index}-qty`}>Quantity</Label>
                  <Input
                    id={`item-${index}-qty`}
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      onItemChange("items", `${index}.quantity`, e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`item-${index}-price`}>Price</Label>
                  <Input
                    id={`item-${index}-price`}
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      onItemChange("items", `${index}.price`, e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`item-${index}-amount`}>Amount</Label>
                  <Input
                    id={`item-${index}-amount`}
                    type="number"
                    value={item.amount}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoiceItemsList;
