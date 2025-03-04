"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BarChart2, DollarSign, Home, Package, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNavigationMenu() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/"}>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            <span>Inicio</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/productos"}>
          <Link href="/productos">
            <Package className="mr-2 h-4 w-4" />
            <span>Productos</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/clientes"}>
          <Link href="/clientes">
            <Users className="mr-2 h-4 w-4" />
            <span>Clientes</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/ventas"}>
          <Link href="/ventas">
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Ventas</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/estadisticas"}>
          <Link href="/estadisticas">
            <BarChart2 className="mr-2 h-4 w-4" />
            <span>Estadísticas</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
