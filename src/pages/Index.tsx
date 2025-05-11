
import React, { useState, useEffect } from "react";
import { Invoice } from "@/types";
import InvoiceEditor from "@/components/invoice/InvoiceEditor";
import LoadingIndicator from "@/components/invoice/LoadingIndicator";
import { invoiceApi } from "@/services/api";

// Default invoice data
const defaultInvoice: Invoice = {
  name: "New Invoice",
  elements: [],
  paperSize: "A4",
  data: {
    title: "Invoice",
    customer: {
      name: "Client Name",
      email: "client@example.com",
      address: "123 Client Street, City, Country",
      phone: "",
    },
    company: {
      name: "Your Company",
      email: "company@example.com",
      address: "456 Business Avenue, City, Country",
      phone: "+1 (555) 123-4567",
      logo: "", 
    },
    items: [
      {
        description: "Service Description",
        quantity: 1,
        price: 100,
        amount: 100,
      },
    ],
    subtotal: 100,
    tax: 10,
    total: 110,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "Thank you for your business!",
    terms: "Payment due within 14 days of receipt.",
    status: "draft",
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  },
};

const Index = () => {
  const [invoice, setInvoice] = useState<Invoice>(defaultInvoice);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load demo invoice
    const loadInitialInvoice = async () => {
      try {
        const invoices = await invoiceApi.getInvoices();
        if (invoices.length > 0) {
          setInvoice(invoices[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load invoice:", error);
        setIsLoading(false);
      }
    };

    loadInitialInvoice();
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return <InvoiceEditor initialInvoice={invoice} />;
};

export default Index;
