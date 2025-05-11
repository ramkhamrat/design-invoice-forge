
export interface ElementPosition {
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
}

export interface ElementStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: number;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: string;
  borderRadius?: number;
}

export interface InvoiceElement {
  id: string;
  type: 'text' | 'image' | 'line' | 'table';
  content: string | string[][] | null;
  position: ElementPosition;
  style: ElementStyle;
  fieldVariable?: string;
}

export interface InvoiceData {
  id?: string;
  title: string;
  customer: {
    name: string;
    email: string;
    address: string;
    phone?: string;
  };
  company: {
    name: string;
    email: string;
    address: string;
    phone?: string;
    logo?: string;
  };
  items: {
    description: string;
    quantity: number;
    price: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  dueDate: string;
  notes?: string;
  terms?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  invoiceNumber: string;
}

export interface Invoice {
  id?: string;
  name: string;
  elements: InvoiceElement[];
  data: InvoiceData;
  createdAt?: string;
  updatedAt?: string;
}
