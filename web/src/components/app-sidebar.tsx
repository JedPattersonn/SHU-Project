"use client";

import * as React from "react";
import { BookOpen, PlugZap, Map, PieChart } from "lucide-react";
import { NavOptions } from "./nav-options";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "better-auth";
import Link from "next/link";

const data = {
  items: [
    {
      name: "Dashboard",
      url: "/",
      icon: PieChart,
    },
    {
      name: "History",
      url: "/history",
      icon: BookOpen,
    },
    // {
    //   name: "Zip Code Search",
    //   url: "/zip-code-search",
    //   icon: Map,
    // },
    {
      name: "Heatmap",
      url: "/map",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <PlugZap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    Smart Energy Dashboard
                  </span>
                  <span className="truncate text-xs">Group 21</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavOptions projects={data.items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
