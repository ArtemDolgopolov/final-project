"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/auth-client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DeleteButtonProps {
  userId: string;
  onDelete: () => void;
}

export default function DeleteButton({ userId, onDelete }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await authClient.admin.removeUser({
        userId: userId
      });
      toast({
        title: "User deleted",
        description: "The user has been deleted.",
      });
      if (res?.data?.success) {
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
    <Button variant="outline" onClick={handleDelete} disabled={loading} size="sm">
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}