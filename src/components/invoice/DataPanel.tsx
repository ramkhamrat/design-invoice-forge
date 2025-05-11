
import React from "react";
import { InvoiceData } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTotals } from "@/lib/utils";
import { isItemsField, isNestedField } from "@/lib/invoice-utils";
import InvoiceTab from "./data-panel/InvoiceTab";
import CompanyTab from "./data-panel/CompanyTab";
import CustomerTab from "./data-panel/CustomerTab";

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
    if (isItemsField(section)) {
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
    } else if (isNestedField(section)) {
      // Explicitly type this as an object before spreading
      const nestedObject = data[section] as Record<string, any>;
      
      onDataChange({
        ...data,
        [section]: {
          ...nestedObject,
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

        <TabsContent value="invoice">
          <InvoiceTab 
            data={data} 
            onDataChange={handleChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
          />
        </TabsContent>

        <TabsContent value="company">
          <CompanyTab 
            company={data.company} 
            onDataChange={handleChange} 
          />
        </TabsContent>

        <TabsContent value="customer">
          <CustomerTab 
            customer={data.customer} 
            onDataChange={handleChange} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataPanel;
