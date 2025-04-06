"use client";

import * as React from "react";
import {
  BookOpen,
  PlugZap,
  Map,
  PieChart,
  Users,
  Database,
} from "lucide-react";
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
import Link from "next/link";
import { user as User } from "@/lib/db/schema";

const getMenuItems = (user: typeof User.$inferSelect) => {
  const baseItems = [
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
  ];

  const adminItems = [
    {
      name: "Users",
      url: "/users",
      icon: Users,
    },
    {
      name: "Data",
      url: "/data",
      icon: Database,
    },
  ];

  return {
    baseItems,
    adminItems: user.role === "admin" ? adminItems : [],
  };
};

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: typeof User.$inferSelect;
}) {
  const { baseItems, adminItems } = getMenuItems(user);

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
        <NavOptions projects={baseItems} />
        {adminItems.length > 0 && (
          <>
            <div className="my-2 px-4">
              <div className="h-px bg-border" />
            </div>
            <div className="px-4 py-2">
              <h2 className="text-sm font-semibold text-muted-foreground">
                Admin
              </h2>
            </div>
            <NavOptions projects={adminItems} />
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
