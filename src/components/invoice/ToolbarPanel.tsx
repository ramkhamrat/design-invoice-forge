
import React from "react";
import { Button } from "@/components/ui/button";
import { InvoiceElement, ElementPosition, ElementStyle } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateId } from "@/lib/utils";
import { File, FileText, Printer, Save } from "lucide-react";

interface ToolbarPanelProps {
  onAddElement: (element: InvoiceElement) => void;
  onSave: () => void;
  onPrint: () => void;
  selectedElement: InvoiceElement | null;
  onDeleteElement: (id: string) => void;
}

const ToolbarPanel: React.FC<ToolbarPanelProps> = ({
  onAddElement,
  onSave,
  onPrint,
  selectedElement,
  onDeleteElement,
}) => {
  const handleAddText = () => {
    const newTextElement: InvoiceElement = {
      id: generateId(),
      type: "text",
      content: "New Text",
      position: { x: 100, y: 100, width: 200, height: 40 },
      style: {
        fontFamily: "Inter",
        fontSize: 16,
        color: "#1A1F2C",
      },
    };
    onAddElement(newTextElement);
  };

  const handleAddImage = () => {
    const newImageElement: InvoiceElement = {
      id: generateId(),
      type: "image",
      content: "/placeholder.svg",
      position: { x: 100, y: 100, width: 150, height: 150 },
      style: {},
    };
    onAddElement(newImageElement);
  };

  const handleAddHeading = () => {
    const newHeadingElement: InvoiceElement = {
      id: generateId(),
      type: "text",
      content: "Heading",
      position: { x: 100, y: 100, width: 300, height: 60 },
      style: {
        fontFamily: "Inter",
        fontSize: 28,
        fontWeight: "700",
        color: "#1A1F2C",
      },
    };
    onAddElement(newHeadingElement);
  };

  const handleAddInvoiceNumber = () => {
    const newElement: InvoiceElement = {
      id: generateId(),
      type: "text",
      content: "Invoice #: {{invoiceNumber}}",
      position: { x: 100, y: 150, width: 300, height: 40 },
      style: {
        fontSize: 16,
        color: "#8E9196",
      },
      fieldVariable: "invoiceNumber",
    };
    onAddElement(newElement);
  };

  const handleAddDate = () => {
    const newElement: InvoiceElement = {
      id: generateId(),
      type: "text",
      content: "Date: {{date}}",
      position: { x: 100, y: 200, width: 300, height: 40 },
      style: {
        fontSize: 16,
        color: "#8E9196",
      },
      fieldVariable: "date",
    };
    onAddElement(newElement);
  };

  const handleAddCustomerInfo = () => {
    const newElement: InvoiceElement = {
      id: generateId(),
      type: "text",
      content: "{{customer.name}}\n{{customer.email}}\n{{customer.address}}",
      position: { x: 100, y: 250, width: 300, height: 100 },
      style: {
        fontSize: 16,
        color: "#8E9196",
      },
      fieldVariable: "customer",
    };
    onAddElement(newElement);
  };

  const handleDelete = () => {
    if (selectedElement) {
      onDeleteElement(selectedElement.id);
    }
  };

  return (
    <div className="p-4 bg-white border rounded-md shadow-sm">
      <Tabs defaultValue="elements" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="elements" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={handleAddText} className="flex items-center justify-start gap-2">
              <FileText className="h-4 w-4" />
              <span>Text</span>
            </Button>
            <Button variant="outline" onClick={handleAddImage} className="flex items-center justify-start gap-2">
              <File className="h-4 w-4" />
              <span>Image</span>
            </Button>
            <Button variant="outline" onClick={handleAddHeading} className="flex items-center justify-start gap-2">
              <FileText className="h-4 w-4" />
              <span>Heading</span>
            </Button>
            <Button variant="outline" onClick={handleAddInvoiceNumber} className="flex items-center justify-start gap-2 text-xs">
              <FileText className="h-4 w-4" />
              <span>Invoice #</span>
            </Button>
            <Button variant="outline" onClick={handleAddDate} className="flex items-center justify-start gap-2">
              <FileText className="h-4 w-4" />
              <span>Date</span>
            </Button>
            <Button variant="outline" onClick={handleAddCustomerInfo} className="flex items-center justify-start gap-2 text-xs">
              <FileText className="h-4 w-4" />
              <span>Customer</span>
            </Button>
          </div>

          {selectedElement && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="destructive" size="sm" onClick={handleDelete} className="w-full">
                Delete Selected Element
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-2">
          <div className="text-center text-sm text-muted-foreground py-6">
            <p>Templates will be available in future updates.</p>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onSave} className="flex items-center justify-center gap-2">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
            <Button variant="outline" onClick={onPrint} className="flex items-center justify-center gap-2">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ToolbarPanel;
