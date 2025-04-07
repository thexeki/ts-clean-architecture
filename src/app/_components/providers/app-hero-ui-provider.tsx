"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { type ReactNode } from "react";

export default function AppHeroUiProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <HeroUIProvider>
      {children}
      <ToastProvider />
    </HeroUIProvider>
  );
}
