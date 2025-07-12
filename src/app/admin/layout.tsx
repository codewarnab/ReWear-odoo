"use client";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/app-sidebar";
import UserDropdown from "@/components/user-dropdown";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="group/sidebar-inset relative overflow-hidden">
        {/* Header integrated with sidebar styling */}
        <header className="dark flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-sidebar text-sidebar-foreground relative z-10">
          <SidebarTrigger className="-ms-2" />
          <div className="flex items-center gap-8 ml-auto">
            <nav className="flex items-center text-sm font-medium max-sm:hidden">
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="/admin"
                aria-current
              >
                Admin
              </a>
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="/admin/dashboard"
              >
                Dashboard
              </a>
              <a
                className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
                href="/admin/moderation"
              >
                Moderation
              </a>
            </nav>
            <UserDropdown />
          </div>
        </header>

        {/* Main content area with rounded top-left corner */}
        <div className="relative h-[calc(100svh-4rem)] bg-[#171717] overflow-hidden">
          {/* Rounded overlay that creates the merge effect */}
          <div className="absolute inset-0 bg-white rounded-tl-[2rem] md:rounded-tl-[3rem] transition-all ease-in-out duration-300 md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-tl-none">
            <div className="h-full w-full p-4">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  );
}
