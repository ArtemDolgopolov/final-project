"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, User } from "@prisma/client";

interface FormsTableProps {
  forms: (Form & { user: User })[];
}

export default function FormsTable({ forms }: FormsTableProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (formId: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;

    setLoading(formId);
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete form");
      }
    } catch (error) {
      alert("Error deleting form");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {forms.map((form) => (
          <TableRow key={form.id}>
            <TableCell>{form.title}</TableCell>
            <TableCell>{form.user.name || "Unknown"}</TableCell>
            <TableCell>{new Date(form.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                onClick={() => handleDelete(form.id)}
                disabled={loading === form.id}
              >
                {loading === form.id ? "Deleting..." : "Delete"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}