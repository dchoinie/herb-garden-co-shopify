"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface CustomerEditFormProps {
  customer: any;
  onUpdate?: (updatedCustomer: any) => void;
}

export default function CustomerEditForm({
  customer,
  onUpdate,
}: CustomerEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: customer?.firstName || "",
    last_name: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    note: customer?.note || "",
    accepts_marketing: customer?.acceptsMarketing || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/customer/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      const result = await response.json();
      onUpdate?.(result.customer);
      setIsEditing(false);
      toast.success("Customer information updated successfully!");
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Failed to update customer information");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
        Edit Information
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
      </div>
      <div>
        <Label htmlFor="note">Note</Label>
        <Textarea
          id="note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="accepts_marketing"
          checked={formData.accepts_marketing}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, accepts_marketing: checked })
          }
        />
        <Label htmlFor="accepts_marketing">Accept Marketing Emails</Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
