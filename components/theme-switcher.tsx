"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export default function ThemeSwitcher() {
  const {theme, setTheme} = useTheme(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <Tabs defaultValue={theme}>
      <TabsList className="border">
        <TabsTrigger
          value="light"
          onClick={() => setTheme("light")}
        >
          L
        </TabsTrigger>
        <TabsTrigger
          value="dark"
          onClick={() => setTheme("dark")}
        >
          D
        </TabsTrigger>
        <TabsTrigger
          value="system"
          onClick={() => setTheme("system")}
        >
          S
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}