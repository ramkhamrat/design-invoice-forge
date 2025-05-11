
import { InvoiceData } from "@/types";

// Type guard to check if a field is the items array
export function isItemsField(field: keyof InvoiceData): boolean {
  return field === "items";
}

// Type guard to check if a field is nested
export function isNestedField(field: keyof InvoiceData): boolean {
  return field === "customer" || field === "company";
}

// Paper sizes in pixels (based on 96dpi)
export const PAPER_SIZES = {
  A4: { width: 794, height: 1123 },  // 210mm x 297mm
  A5: { width: 559, height: 794 },   // 148mm x 210mm 
  SLIP: { width: 800, height: 600 }  // TM220B Slip (custom size)
};

// Paper size type
export type PaperSizeKey = keyof typeof PAPER_SIZES;
