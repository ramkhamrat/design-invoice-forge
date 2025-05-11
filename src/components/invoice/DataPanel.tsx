
import React from "react";
import { InvoiceData } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { calculateTotals } from "@/lib/utils";

interface DataPanelProps {
  data: InvoiceData;
  onDataChange: (data: InvoiceData) => void;
}

const DataPanel: React.FC<DataPanelProps> = ({ data, onDataChange }) => {
  const handleChange = (
    section: keyof InvoiceData,
    field: string,
    value: string | number
  ) => {
    if (section === "items") {
      const updatedItems = [...data.items];
      const [index, itemField] = field.split(".");
      const itemIndex = parseInt(index);
      
      if (updatedItems[itemIndex]) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          [itemField]: itemField === "description" ? value : Number(value),
        };
        
        // Recalculate item amount
        if (itemField === "quantity" || itemField === "price") {
          updatedItems[itemIndex].amount = 
            updatedItems[itemIndex].quantity * updatedItems[itemIndex].price;
        }
        
        // Recalculate totals
        const { subtotal, tax, total } = calculateTotals(updatedItems);
        
        onDataChange({
          ...data,
          items: updatedItems,
          subtotal,
          tax,
          total,
        });
      }
    } else if (typeof data[section] === "object" && section !== "items") {
      onDataChange({
        ...data,
        [section]: {
          ...data[section],
          [field]: value,
        },
      });
    } else {
      onDataChange({
        ...data,
        [section]: value,
      });
    }
  };

  const addItem = () => {
    const newItem = {
      description: "New Item",
      quantity: 1,
      price: 0,
      amount: 0,
    };
    const updatedItems = [...data.items, newItem];
    const { subtotal, tax, total } = calculateTotals(updatedItems);
    
    onDataChange({
      ...data,
      items: updatedItems,
      subtotal,
      tax,
      total,
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = [...data.items];
    updatedItems.splice(index, 1);
    const { subtotal, tax, total } = calculateTotals(updatedItems);
    
    onDataChange({
      ...data,
      items: updatedItems,
      subtotal,
      tax,
      total,
    });
  };

  return (
    <div className="p-4 bg-white border rounded-md shadow-sm max-h-[600px] overflow-y-auto">
      <Tabs defaultValue="invoice">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
        </TabsList>

        <TabsContent value="invoice" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={data.invoiceNumber}
                onChange={(e) => handleChange("invoiceNumber", "", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => handleChange("title", "", e.target.value)}
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
                onChange={(e) => handleChange("date", "", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={data.dueDate}
                onChange={(e) => handleChange("dueDate", "", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <Label>Items</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {data.items.map((item, index) => (
                <div key={index} className="border p-3 rounded-md relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removeItem(index)}
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
                          handleChange("items", `${index}.description`, e.target.value)
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
                            handleChange("items", `${index}.quantity`, e.target.value)
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
                            handleChange("items", `${index}.price`, e.target.value)
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

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={data.notes || ""}
                onChange={(e) => handleChange("notes", "", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="terms">Terms</Label>
              <Textarea
                id="terms"
                value={data.terms || ""}
                onChange={(e) => handleChange("terms", "", e.target.value)}
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
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={data.company.name}
              onChange={(e) => handleChange("company", "name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-email">Email</Label>
            <Input
              id="company-email"
              type="email"
              value={data.company.email}
              onChange={(e) => handleChange("company", "email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-address">Address</Label>
            <Textarea
              id="company-address"
              value={data.company.address}
              onChange={(e) => handleChange("company", "address", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company-phone">Phone</Label>
            <Input
              id="company-phone"
              value={data.company.phone || ""}
              onChange={(e) => handleChange("company", "phone", e.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="customer" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer Name</Label>
            <Input
              id="customer-name"
              value={data.customer.name}
              onChange={(e) => handleChange("customer", "name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={data.customer.email}
              onChange={(e) => handleChange("customer", "email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-address">Address</Label>
            <Textarea
              id="customer-address"
              value={data.customer.address}
              onChange={(e) => handleChange("customer", "address", e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone</Label>
            <Input
              id="customer-phone"
              value={data.customer.phone || ""}
              onChange={(e) => handleChange("customer", "phone", e.target.value)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataPanel;
