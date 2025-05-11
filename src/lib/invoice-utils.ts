
import { InvoiceData } from "@/types";

// Type guard to check if a field is the items array
export function isItemsField(field: keyof InvoiceData): boolean {
  return field === "items";
}

// Type guard to check if a field is nested
export function isNestedField(field: keyof InvoiceData): boolean {
  return field === "customer" || field === "company";
}
