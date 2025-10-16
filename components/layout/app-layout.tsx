"use client";

import type React from "react";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 lg:pl-64">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="mt-16 p-4 lg:p-6">{children}</main>
      </div>
      <SpeedInsights />
    </div>
  );
}
