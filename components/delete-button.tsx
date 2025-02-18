"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/auth-client";
import { useState } from "react";

interface DeleteButtonProps {
  userId: string;
  onDelete: () => void;
}

export default function DeleteButton({ userId, onDelete }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await authClient.admin.removeUser({
        userId: userId
      });

      if (res.ok) {
        onDelete();
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      alert("Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}