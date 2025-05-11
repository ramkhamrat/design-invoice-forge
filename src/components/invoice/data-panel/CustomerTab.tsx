
import React from "react";
import { InvoiceData } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerTabProps {
  customer: InvoiceData["customer"];
  onDataChange: (section: keyof InvoiceData, field: string, value: string) => void;
}

const CustomerTab: React.FC<CustomerTabProps> = ({ customer, onDataChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customer-name">Customer Name</Label>
        <Input
          id="customer-name"
          value={customer.name}
          onChange={(e) => onDataChange("customer", "name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customer-email">Email</Label>
        <Input
          id="customer-email"
          type="email"
          value={customer.email}
          onChange={(e) => onDataChange("customer", "email", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customer-address">Address</Label>
        <Textarea
          id="customer-address"
          value={customer.address}
          onChange={(e) => onDataChange("customer", "address", e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customer-phone">Phone</Label>
        <Input
          id="customer-phone"
          value={customer.phone || ""}
          onChange={(e) => onDataChange("customer", "phone", e.target.value)}
        />
      </div>
    </div>
  );
};

export default CustomerTab;
