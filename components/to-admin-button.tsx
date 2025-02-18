"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ToAdminUserProps {
  userId: string;
  onRoleChange?: (userId: string, role: string) => void;
}

export default function ToAdminButton({ userId, onRoleChange }: ToAdminUserProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleToAdminUser = async () => {
    try {
      await authClient.admin.setRole({
        userId,
        role: "admin",
      });
      toast({
        title: "User is now an admin",
        description: "Admin access granted to this user.",
      });
      if (onRoleChange) {
        onRoleChange(userId, "admin");
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to set user as admin:", error);
    }
  };

  return (
    <Button onClick={handleToAdminUser} variant="outline" size="sm">
      To Admin
    </Button>
  );
}