"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

const OwnerAuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const { accessToken, role } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (accessToken === undefined || role === undefined) return;
  
    const publicPaths = ["/login", "/signup", "/forgot-password", "/", "/shop", "/shop/halfsized-food-warmer", "/about-us"]; // Add any other public paths here
    const customerPaths = ["/account", "/checkout", "/receipt", "/", "/shop"]; // Add any other customer paths here
      
    
    if (publicPaths.includes(pathname)) {
      // If logged in and on a public page, redirect properly
      if (accessToken && role === "owner") {
        console.log("Owner detected on public page, redirecting to orders...");
        router.replace("/orders");
        return;
      }
  
      if (accessToken && role === "customer") {
        console.log("Customer detected on public page, redirecting to account...");
        router.replace("/account");
        return;
      }
      
      // Not logged in, allow access to public page
      setIsAuthorized(true);
      return;
    }
  
    // If the user is trying to access customer pages and is an owner, redirect them
    if (customerPaths.includes(pathname) && role === "owner") {
      console.log("Owner detected on customer page, redirecting to orders...");
      router.replace("/orders");
      setIsAuthorized(false);
      return;
    }
  
    // Now user is on a protected page (not public)
    
    if (!accessToken && !publicPaths.includes(pathname)) {
      console.log("No access token, redirecting to login...");
      router.replace("/login");
      setIsAuthorized(false);
      return;
    }
  
    // If token exists and roles match, allow access to protected pages
    if (accessToken && role === "owner") {
      setIsAuthorized(true);  //  Allow to view /orders, /inventory, /admin/settings, etc.
      return;
    }

    if (accessToken && role === "customer") {
      setIsAuthorized(true);  //  Allow to view customer routes.
      return;
    }
  
    if (role === "customer") {
      console.log("Customer trying to access protected page, redirecting to account...");
      router.replace("/account");
      setIsAuthorized(false);
      return;
    }
  
    // fallback
    router.replace("/login");
    setIsAuthorized(false);
  }, [accessToken, role, router, pathname]);
  

  // Show loading state while checking auth
  // if (isAuthorized === null) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-[#FFFBF5] z-50">
  //       <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#778768] border-r-transparent" />
  //       <span className="ml-2 text-gray-500 text-lg font-semibold">
  //         Verifying access...
  //       </span>
  //     </div>
  //   );
  // }

  // Only render children if authorized or on public path
  return isAuthorized ? (
    <>{children}</>
  ) : (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FFFBF5] z-50">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#778768] border-r-transparent" />
      <span className="ml-2 text-gray-500 text-lg font-semibold">
        Verifying access...
      </span>
    </div>
  );
};

export default OwnerAuthRedirect;
