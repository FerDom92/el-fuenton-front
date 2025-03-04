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
        <SidebarHeaderComponent />
      </SidebarHeader>
      <SidebarContent className="px-4 mt-4">
        <SidebarNavigationMenu />
      </SidebarContent>
      <SidebarDate />
      <SidebarFooter className="border-t p-4">
        <SidebarFooterComponent />
      </SidebarFooter>
    </Sidebar>
  );
}
