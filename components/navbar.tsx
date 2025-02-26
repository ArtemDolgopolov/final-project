"use client"

import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import SignoutButton from "./signout-button";
// import { Session } from "@/auth";
// import ThemeSwitcher from "./theme-switcher";
import AuthButtons from "./auth-buttons";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-3 px-4 fixed top-0 left-0 right-0 z-50 bg-slate-100">
      <Link href="/" className="text-xl font-bold">
        Forms Creator
      </Link>
      {/* <ThemeSwitcher /> */}
      <AuthButtons />

      {/* {!session ? (
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
          <ThemeSwitcher />
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
      )} */}
    </nav>
  );
}