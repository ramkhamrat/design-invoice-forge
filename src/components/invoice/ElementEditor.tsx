
import React from "react";
import { InvoiceElement, ElementStyle } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { generateId } from "@/lib/utils";

interface ElementEditorProps {
  element: InvoiceElement | null;
  onUpdate: (element: InvoiceElement) => void;
  onClose: () => void;
}

const fontFamilies = ["Inter", "Arial", "Times New Roman", "Courier New", "Georgia", "Verdana"];
const fontWeights = ["normal", "bold", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
const textAlignOptions = ["left", "center", "right"];

const ElementEditor: React.FC<ElementEditorProps> = ({ element, onUpdate, onClose }) => {
  if (!element) return null;

  const handleStyleChange = (key: keyof ElementStyle, value: any) => {
    const updatedElement: InvoiceElement = {
      ...element,
      style: {
        ...element.style,
        [key]: value,
      },
    };
    onUpdate(updatedElement);
  };

  const handleContentChange = (value: string) => {
    const updatedElement: InvoiceElement = {
      ...element,
      content: value,
    };
    onUpdate(updatedElement);
  };

  const handlePositionChange = (key: string, value: number) => {
    const updatedElement: InvoiceElement = {
      ...element,
      position: {
        ...element.position,
        [key]: value,
      },
    };
    onUpdate(updatedElement);
  };

  const handleFieldVariableChange = (value: string) => {
    const updatedElement: InvoiceElement = {
      ...element,
      fieldVariable: value,
      content: value ? `{{${value}}}` : element.content,
    };
    onUpdate(updatedElement);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full max-h-[500px] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Edit Element</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      
      <Tabs defaultValue="content">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          {element.type === "text" && (
            <div className="space-y-2">
              <Label htmlFor="content">Text Content</Label>
              <Input
                id="content"
                value={typeof element.content === 'string' ? element.content : ''}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select
                value={element.style.fontFamily || "Inter"}
                onValueChange={(value) => handleStyleChange("fontFamily", value)}
              >
                <SelectTrigger id="font-family">
                  <SelectValue placeholder="Font Family" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="font-weight">Font Weight</Label>
              <Select
                value={element.style.fontWeight || "normal"}
                onValueChange={(value) => handleStyleChange("fontWeight", value)}
              >
                <SelectTrigger id="font-weight">
                  <SelectValue placeholder="Font Weight" />
                </SelectTrigger>
                <SelectContent>
                  {fontWeights.map((weight) => (
                    <SelectItem key={weight} value={weight}>
                      {weight}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size ({element.style.fontSize || 16}px)</Label>
            <Slider
              id="font-size"
              min={8}
              max={72}
              step={1}
              value={[element.style.fontSize || 16]}
              onValueChange={(value) => handleStyleChange("fontSize", value[0])}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  id="text-color"
                  className="w-10 h-10 p-1"
                  value={element.style.color || "#000000"}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                />
                <Input
                  type="text"
                  value={element.style.color || "#000000"}
                  onChange={(e) => handleStyleChange("color", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  id="bg-color"
                  className="w-10 h-10 p-1"
                  value={element.style.backgroundColor || "#ffffff"}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                />
                <Input
                  type="text"
                  value={element.style.backgroundColor || "#ffffff"}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text-align">Text Alignment</Label>
            <Select
              value={element.style.textAlign || "left"}
              onValueChange={(value) => 
                handleStyleChange("textAlign", value as "left" | "center" | "right")
              }
            >
              <SelectTrigger id="text-align">
                <SelectValue placeholder="Text Align" />
              </SelectTrigger>
              <SelectContent>
                {textAlignOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="position" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pos-x">X Position (px)</Label>
              <Input
                id="pos-x"
                type="number"
                value={element.position.x}
                onChange={(e) => handlePositionChange("x", parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pos-y">Y Position (px)</Label>
              <Input
                id="pos-y"
                type="number"
                value={element.position.y}
                onChange={(e) => handlePositionChange("y", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width (px)</Label>
              <Input
                id="width"
                type="number"
                value={element.position.width || 100}
                onChange={(e) => handlePositionChange("width", parseInt(e.target.value) || 100)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (px)</Label>
              <Input
                id="height"
                type="number"
                value={element.position.height || 30}
                onChange={(e) => handlePositionChange("height", parseInt(e.target.value) || 30)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rotation">Rotation (degrees)</Label>
            <Slider
              id="rotation"
              min={0}
              max={360}
              step={1}
              value={[element.position.rotation || 0]}
              onValueChange={(value) => handlePositionChange("rotation", value[0])}
            />
            <div className="text-center text-sm text-muted-foreground">
              {element.position.rotation || 0}°
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="field-variable">Field Variable</Label>
            <Select
              value={element.fieldVariable || ""}
              onValueChange={handleFieldVariableChange}
            >
              <SelectTrigger id="field-variable">
                <SelectValue placeholder="Select data field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                <SelectItem value="invoiceNumber">Invoice Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="company.name">Company Name</SelectItem>
                <SelectItem value="company.email">Company Email</SelectItem>
                <SelectItem value="company.address">Company Address</SelectItem>
                <SelectItem value="company.phone">Company Phone</SelectItem>
                <SelectItem value="customer.name">Customer Name</SelectItem>
                <SelectItem value="customer.email">Customer Email</SelectItem>
                <SelectItem value="customer.address">Customer Address</SelectItem>
                <SelectItem value="customer.phone">Customer Phone</SelectItem>
                <SelectItem value="subtotal">Subtotal</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="total">Total</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {element.fieldVariable && (
            <div className="p-3 rounded-md bg-invoice-bg-light text-sm">
              <p>This element will display data from <code>{{'{{'}{element.fieldVariable}{{'}}'}} </code></p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ElementEditor;
