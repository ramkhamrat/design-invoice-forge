
import React from "react";
import { InvoiceData } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompanyTabProps {
  company: InvoiceData["company"];
  onDataChange: (section: keyof InvoiceData, field: string, value: string) => void;
}

const CompanyTab: React.FC<CompanyTabProps> = ({ company, onDataChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company-name">Company Name</Label>
        <Input
          id="company-name"
          value={company.name}
          onChange={(e) => onDataChange("company", "name", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-email">Email</Label>
        <Input
          id="company-email"
          type="email"
          value={company.email}
          onChange={(e) => onDataChange("company", "email", e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-address">Address</Label>
        <Textarea
          id="company-address"
          value={company.address}
          onChange={(e) => onDataChange("company", "address", e.target.value)}
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company-phone">Phone</Label>
        <Input
          id="company-phone"
          value={company.phone || ""}
          onChange={(e) => onDataChange("company", "phone", e.target.value)}
        />
      </div>
    </div>
  );
};

export default CompanyTab;
