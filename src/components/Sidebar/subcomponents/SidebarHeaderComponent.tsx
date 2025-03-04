"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context"; // Importación actualizada

export default function SidebarHeaderComponent() {
  const { user } = useAuth();

  const initials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "UN";

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="h-16 w-16">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="text-sm font-medium">{user?.username || "Usuario"}</p>
        <p className="text-xs text-muted-foreground">
          {user?.email || "usuario@ejemplo.com"}
        </p>
      </div>
    </div>
  );
}
