// src/app/layout.tsx
"use client";

import { ToasterProvider } from "@/components/providers/toaster-provider";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/auth-context";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // For auth routes, use a simplified layout without sidebar
  if (isAuthRoute) {
    return (
      <html lang="es" suppressHydrationWarning>
        <body>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <ToasterProvider />
                <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
              </ThemeProvider>
            </AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </body>
      </html>
    );
  }

  // For regular routes, use the normal layout with sidebar
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
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
          </AuthProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
