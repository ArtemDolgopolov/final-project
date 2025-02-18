"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface BanUserProps {
  userId: string;
  onStatusChange?: (userId: string, banned: boolean) => void;
}

export default function BanButton({ userId, onStatusChange }: BanUserProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleBanUser = async () => {
    try {
      await authClient.admin.banUser({ userId });
      toast({
        title: "User banned",
        description: "The user has been banned successfully.",
      });
      if (onStatusChange) {
        onStatusChange(userId, true);
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to ban user:", error);
    }
  };

  return (
    <Button onClick={handleBanUser} variant="outline" size="sm">
      Ban
    </Button>
  );
}