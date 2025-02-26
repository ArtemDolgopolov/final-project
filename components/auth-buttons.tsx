"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignoutButton from "./signout-button";
import { authClient } from "@/auth-client";

export default function AuthButtons() {
  const { data, isPending } = authClient.useSession();
  if (isPending) return <div>Loading...</div>

  const session = data;

  return !session ? (
        <div className="flex gap-2">
          <Link href="/sign-in">
            <Button variant="default">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="default">Sign Up</Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {session.user.role === "admin" && (
            <Link href="/admin">
              <Button variant="default">Admin</Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button variant="default">Dashboard</Button>
          </Link>
          <SignoutButton />
        </div>
      );
}