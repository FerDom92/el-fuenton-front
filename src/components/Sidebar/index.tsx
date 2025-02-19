"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SidebarDate } from "./subcomponents/SidebarDate";
import SidebarFooterComponent from "./subcomponents/SidebarFooterComponent";
import SidebarHeaderComponent from "./subcomponents/SidebarHeaderComponent";
import SidebarNavigationMenu from "./subcomponents/SidebarNavigationMenu";

export default function SidebarComponent() {
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <SidebarHeaderComponent
          user={{
            name: "Nombre Usuario",
            email: "usuario@ejemplo.com",
            imageUrl: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
          }}
        />
      </SidebarHeader>
      <SidebarContent className="px-4 mt-4">
        <SidebarNavigationMenu />
      </SidebarContent>
      <SidebarDate />
      <SidebarFooter className="border-t p-4">
        <SidebarFooterComponent onLogout={() => console.log("Logout")} />
      </SidebarFooter>
    </Sidebar>
  );
}
