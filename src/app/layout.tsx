"use client";

import { ToasterProvider } from "@/components/providers/toaster-provider";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, type ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToasterProvider />
            <SidebarProvider>
              <div className="flex h-screen w-full bg-background text-foreground">
                <Sidebar />
                <Suspense fallback={<p>Loading...</p>}>
                  <main className="flex-1 overflow-y-auto p-8">
                    <SidebarTrigger />
                    {children}
                  </main>
                </Suspense>
              </div>
            </SidebarProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
