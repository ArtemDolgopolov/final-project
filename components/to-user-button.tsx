"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ToUserAdminProps {
  userId: string;
  onRoleChange?: (userId: string, role: string) => void;
}

export default function ToUserButton({ userId, onRoleChange }: ToUserAdminProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleToUser = async () => {
    try {
      await authClient.admin.setRole({
        userId,
        role: "user",
      });
      toast({
        title: "User role reverted",
        description: "Admin access has been revoked.",
      });
      if (onRoleChange) {
        onRoleChange(userId, "user");
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to set user as user:", error);
    }
  };

  return (
    <Button onClick={handleToUser} variant="outline" size="sm">
      To User
    </Button>
  );
}