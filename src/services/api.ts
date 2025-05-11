
import { Invoice } from "@/types";
import { toast } from "@/components/ui/sonner";

// Mock data for demo purposes
const DEMO_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    name: "Basic Invoice Template",
    elements: [
      {
        id: "elem-001",
        type: "text",
        content: "INVOICE",
        position: { x: 50, y: 50, width: 300, height: 60 },
        style: {
          fontFamily: "Inter",
          fontSize: 32,
          fontWeight: "700",
          color: "#1A1F2C",
        },
      },
      {
        id: "elem-002",
        type: "text",
        content: "Invoice #: {{invoiceNumber}}",
        position: { x: 50, y: 120, width: 300, height: 30 },
        style: {
          fontSize: 16,
          color: "#8E9196",
        },
        fieldVariable: "invoiceNumber",
      },
      {
        id: "elem-003",
        type: "text",
        content: "Date: {{date}}",
        position: { x: 50, y: 150, width: 300, height: 30 },
        style: {
          fontSize: 16,
          color: "#8E9196",
        },
        fieldVariable: "date",
      },
      {
        id: "elem-004",
        type: "text",
        content: "Due Date: {{dueDate}}",
        position: { x: 50, y: 180, width: 300, height: 30 },
        style: {
          fontSize: 16,
          color: "#8E9196",
        },
        fieldVariable: "dueDate",
      },
      {
        id: "elem-005",
        type: "text",
        content: "From:",
        position: { x: 50, y: 240, width: 300, height: 30 },
        style: {
          fontSize: 18,
          fontWeight: "600",
          color: "#1A1F2C",
        },
      },
      {
        id: "elem-006",
        type: "text",
        content: "{{company.name}}\n{{company.address}}\n{{company.email}}\n{{company.phone}}",
        position: { x: 50, y: 270, width: 300, height: 100 },
        style: {
          fontSize: 16,
          color: "#8E9196",
        },
        fieldVariable: "company",
      },
      {
        id: "elem-007",
        type: "text",
        content: "To:",
        position: { x: 400, y: 240, width: 300, height: 30 },
        style: {
          fontSize: 18,
          fontWeight: "600",
          color: "#1A1F2C",
        },
      },
      {
        id: "elem-008",
        type: "text",
        content: "{{customer.name}}\n{{customer.address}}\n{{customer.email}}\n{{customer.phone}}",
        position: { x: 400, y: 270, width: 300, height: 100 },
        style: {
          fontSize: 16,
          color: "#8E9196",
        },
        fieldVariable: "customer",
      }
    ],
    data: {
      title: "Invoice",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        address: "123 Main St, Anytown, CA 12345",
        phone: "+1 (555) 123-4567",
      },
      company: {
        name: "Design Agency Inc.",
        email: "contact@designagency.com",
        address: "456 Business Ave, Suite 200, San Francisco, CA 94107",
        phone: "+1 (555) 987-6543",
      },
      items: [
        {
          description: "Website Design",
          quantity: 1,
          price: 1200,
          amount: 1200,
        },
        {
          description: "UI/UX Consulting",
          quantity: 10,
          price: 150,
          amount: 1500,
        },
        {
          description: "Content Creation",
          quantity: 5,
          price: 100,
          amount: 500,
        },
      ],
      subtotal: 3200,
      tax: 320,
      total: 3520,
      date: "2025-05-01",
      dueDate: "2025-05-15",
      notes: "Thank you for your business!",
      terms: "Payment due within 14 days of receipt.",
      status: "sent",
      invoiceNumber: "INV-2025-001",
    },
  },
];

// API Service
export const invoiceApi = {
  // Get all invoices
  getInvoices: async (): Promise<Invoice[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DEMO_INVOICES);
      }, 500);
    });
  },
  
  // Get invoice by ID
  getInvoice: async (id: string): Promise<Invoice | undefined> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const invoice = DEMO_INVOICES.find((inv) => inv.id === id);
        resolve(invoice);
      }, 500);
    });
  },
  
  // Create new invoice
  createInvoice: async (invoice: Omit<Invoice, 'id'>): Promise<Invoice> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newInvoice: Invoice = {
          ...invoice,
          id: `inv-${Date.now().toString(36)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        DEMO_INVOICES.push(newInvoice);
        toast.success("Invoice created successfully");
        resolve(newInvoice);
      }, 700);
    });
  },
  
  // Update invoice
  updateInvoice: async (invoice: Invoice): Promise<Invoice> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = DEMO_INVOICES.findIndex((inv) => inv.id === invoice.id);
        if (index === -1) {
          toast.error("Invoice not found");
          reject(new Error("Invoice not found"));
          return;
        }
        
        const updatedInvoice: Invoice = {
          ...invoice,
          updatedAt: new Date().toISOString(),
        };
        DEMO_INVOICES[index] = updatedInvoice;
        toast.success("Invoice updated successfully");
        resolve(updatedInvoice);
      }, 700);
    });
  },
  
  // Delete invoice
  deleteInvoice: async (id: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = DEMO_INVOICES.findIndex((inv) => inv.id === id);
        if (index === -1) {
          toast.error("Invoice not found");
          reject(new Error("Invoice not found"));
          return;
        }
        
        DEMO_INVOICES.splice(index, 1);
        toast.success("Invoice deleted successfully");
        resolve();
      }, 700);
    });
  },
};
