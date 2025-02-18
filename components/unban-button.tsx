"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface UnbanUserProps {
  userId: string;
  onStatusChange?: (userId: string, banned: boolean) => void;
}

export default function UnbanButton({ userId, onStatusChange }: UnbanUserProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleUnbanUser = async () => {
    try {
      await authClient.admin.unbanUser({ userId });
      toast({
        title: "User unbanned",
        description: "The user has been unbanned successfully.",
      });
      if (onStatusChange) {
        onStatusChange(userId, false);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to unban user:", error);
    }
  };

  return (
    <Button onClick={handleUnbanUser} variant="outline" size="sm">
      Unban
    </Button>
  );
}