"use client";

import { useAuth } from "@/context/auth-context"; // Importación actualizada
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function SidebarFooterComponent() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex justify-between items-center">
      <button
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4 inline" />
        Cerrar sesión
      </button>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="p-2 rounded-md hover:bg-accent"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
