"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // Create navigation data with dynamic active state
  const navigationData = {
    navMain: [
      {
        title: "Admin",
        url: "#",
        items: [
          {
            title: "Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard,
            isActive: pathname === "/admin/dashboard",
          },
          {
            title: "Moderation",
            url: "/admin/moderation",
            icon: Shield,
            isActive: pathname === "/admin/moderation",
          },
          {
            title: "Manage Users",
            url: "/admin/users",
            icon: Users,
            isActive: pathname === "/admin/users",
          },
        ],
      },
    ],
  };

  // Add effect to force mobile sidebar styling
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      [data-mobile="true"][data-sidebar="sidebar"] {
        background-color: #000000 !important;
      }
      [data-mobile="true"] [data-slot="sidebar-header"] {
        background-color: #000000 !important;
      }
      [data-mobile="true"] [data-slot="sidebar-content"] {
        background-color: #000000 !important;
      }
      /* Mobile sidebar menu item styling */
      [data-mobile="true"] .text-sidebar-foreground\\/50 {
        color: white !important;
      }
      [data-mobile="true"] [data-active="true"] .text-sidebar-foreground\\/50 {
        color: white !important;
      }
      [data-mobile="true"] span {
        color: white !important;
      }
      [data-mobile="true"] [data-active="true"] span {
        color: white !important;
      }
      [data-mobile="true"] [data-active="true"] {
        background: linear-gradient(to bottom, #3b82f6, rgba(59, 130, 246, 0.7)) !important;
      }
      /* Mobile sidebar group label styling */
      [data-mobile="true"] .uppercase {
        color: rgba(255, 255, 255, 0.6) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <Sidebar 
      {...props} 
      className="dark !border-none text-white overflow-hidden bg-black md:bg-sidebar"
      style={{
        "--sidebar-background": "#000000",
        "--sidebar-foreground": "#ffffff",
      } as React.CSSProperties}
    >
      <SidebarHeader 
        className="px-6 py-4 border-b border-gray-800 md:border-gray-200 md:dark:border-gray-800 bg-black md:bg-transparent"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <h1 className="text-2xl font-bold text-white md:text-gray-900 md:dark:text-white">ReWear</h1>
        </div>
      </SidebarHeader>
      <SidebarContent 
        className="bg-black md:bg-sidebar"
        style={{ backgroundColor: "#000000" }}
      >
        {/* We only show the first parent group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            {navigationData.navMain[0]?.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {navigationData.navMain[0]?.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md data-[active=true]:hover:bg-transparent data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto"
                    isActive={item.isActive}
                  >
                    <a href={item.url}>
                      {item.icon && (
                        <item.icon
                          className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground"
                          size={22}
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
