"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Contact,
  DoorOpen,
  History,
  Utensils,
  ShoppingCart,
  Cake,
  HandPlatter,
  Users,
  Tag,
  Menu,
  X,
  ChevronLeft,
  Settings,
  LogOut,
  Bell,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { icons } from "@/constants";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { cn } from "@/lib/utils";

interface OwnerLayoutProps {
  children: ReactNode;
}

const navLinks = [
  {
    name: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    name: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    name: "Rentals",
    href: "/rentals",
    icon: Utensils,
  },
  {
    name: "Services",
    href: "/services",
    icon: HandPlatter,
  },
  {
    name: "Events",
    href: "/events",
    icon: Cake,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    name: "Partners",
    href: "/partners",
    icon: Contact,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Tag,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
];

const OwnerLayout: React.FC<OwnerLayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const onLogout = () => {
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(logout());
    router.push("/login");
  };

  const currentPageName =
    navLinks.find((link) => pathname.startsWith(link.href))?.name || "Dashboard";

  return (
    <div className="bg-[#FFFBF5] min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-[#E5E7EB] z-50 transition-all duration-300 ease-in-out",
          // Mobile: slide in/out
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: always visible
          "lg:translate-x-0",
          // Width based on collapsed state
          isCollapsed ? "lg:w-[80px]" : "lg:w-[280px]",
          "w-[280px]"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
          <Link href="/orders" className="flex items-center gap-3">
            <img
              src={icons.logoleaf.src}
              alt="Min-Jee Logo"
              className="w-10 h-10 flex-shrink-0"
            />
            {!isCollapsed && (
              <span className="text-camouflage-500 text-2xl font-caveat_bold tracking-wide">
                MIN-JEE
              </span>
            )}
          </Link>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Info */}
        <div
          className={cn(
            "px-5 py-4 border-b border-[#E5E7EB]",
            isCollapsed && "lg:px-3 lg:py-3"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-camouflage-400 to-camouflage-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">RD</span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-[#374151] font-semibold text-sm truncate">
                  Rita Dellatan
                </p>
                <p className="text-[#9CA3AF] text-xs">Owner</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link href={link.href} key={link.name}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                      isActive
                        ? "bg-camouflage-400 text-white shadow-md shadow-camouflage-400/25"
                        : "text-[#6B7280] hover:bg-camouflage-50 hover:text-camouflage-600",
                      isCollapsed && "lg:justify-center lg:px-2"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-transform",
                        !isActive && "group-hover:scale-110"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{link.name}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse Toggle - Desktop only */}
        <div className="hidden lg:block absolute bottom-4 right-0 translate-x-1/2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 bg-white border border-[#E5E7EB] rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:border-camouflage-300"
          >
            <ChevronLeft
              className={cn(
                "w-4 h-4 text-gray-500 transition-transform duration-300",
                isCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          isCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"
        )}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left side - Mobile menu + Page title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-afacad_semibold text-camouflage-500">
                  {currentPageName}
                </h1>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-camouflage-400 to-camouflage-600 flex items-center justify-center">
                      <span className="text-white font-medium text-xs">RD</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      Rita
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      Rita Dellatan
                    </p>
                    <p className="text-xs text-gray-500">rita@minjee.com</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default OwnerLayout;
