
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { InvoiceData, InvoiceElement } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getElementStyle(element: InvoiceElement): React.CSSProperties {
  const { position, style } = element;
  
  return {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: position.width ? `${position.width}px` : 'auto',
    height: position.height ? `${position.height}px` : 'auto',
    transform: position.rotation ? `rotate(${position.rotation}deg)` : undefined,
    fontFamily: style.fontFamily || 'Inter, sans-serif',
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    fontWeight: style.fontWeight || undefined,
    color: style.color || undefined,
    backgroundColor: style.backgroundColor || undefined,
    textAlign: style.textAlign || undefined,
    padding: style.padding ? `${style.padding}px` : undefined,
    borderWidth: style.borderWidth ? `${style.borderWidth}px` : undefined,
    borderColor: style.borderColor || undefined,
    borderStyle: style.borderStyle || undefined,
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
  };
}

export function bindFieldVariable(content: string | string[][] | null, data: InvoiceData): string | string[][] | null {
  if (!content || typeof content !== 'string' || !content.includes('{{')) {
    return content;
  }
  
  return content.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const parts = path.trim().split('.');
    let value: any = data;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return match; // Keep the original placeholder if path is invalid
      }
    }
    
    return value?.toString() || match;
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function calculateTotals(items: { quantity: number; price: number }[]): { 
  subtotal: number; 
  tax: number; 
  total: number 
} {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.1; // Assuming 10% tax rate
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
}
