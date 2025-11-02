'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Nav from "@/components/nav";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, LogOut, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth, useUser, useCollection } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function useUserOrganization() {
  const { user, loading: userLoading } = useUser();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: orgs, loading: orgsLoading } = useCollection('organizations', {
    constraints: user ? [
      // This is a placeholder constraint. Firestore requires at least one constraint
      // for collection group queries if rules are based on it.
      // We are finding the org by iterating, not via a where clause.
    ] : undefined
  });

  useEffect(() => {
    if (userLoading || orgsLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const foundOrg = orgs.find((org: any) => org.ownerId === user.uid);
    // A more robust solution might check a `members` subcollection
    
    if (foundOrg) {
      setOrgId(foundOrg.id);
    }
    setLoading(false);
  }, [user, orgs, userLoading, orgsLoading]);

  return { orgId, loading: userLoading || loading };
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useAuth();
  const { user, loading: userLoading, error } = useUser();
  const { orgId, loading: orgLoading } = useUserOrganization();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
    if (!userLoading && user && !orgLoading && !orgId) {
      router.push('/onboarding');
    }
  }, [user, userLoading, orgId, orgLoading, router]);

  const handleSignOut = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  const isLoading = userLoading || orgLoading;

  if (isLoading || !user || !orgId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">M</div>
            <span className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">MSP Command</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-9 w-9">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
              <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">{user.displayName || 'Admin User'}</span>
              <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="ml-auto group-data-[collapsible=icon]:hidden">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden"/>
            <h1 className="text-xl font-semibold hidden md:block">MSP Command Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// This is a new context provider to pass orgId to child components
export const OrgContext = React.createContext<{ orgId: string | null }>({ orgId: null });

function AppLayoutWithOrgContext({ children }: { children: React.ReactNode }) {
  const { orgId } = useUserOrganization();
  return <OrgContext.Provider value={{ orgId }}>{children}</OrgContext.Provider>
}

// We need to wrap the export with the context provider
const AppLayoutWithProvider = ({children}: {children: React.ReactNode}) => (
    <AppLayout>
      <AppLayoutWithOrgContext>
          {children}
      </AppLayoutWithOrgContext>
    </AppLayout>
);

// We have to export default the wrapped layout
// export default AppLayoutWithProvider;
// The above line causes issues, so let's try a different pattern.
// Let's modify the original component to use the context.
function AppLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
   const { orgId } = useUserOrganization();

   // The main layout already handles loading and redirection.
   // We just need to provide the orgId to the rest of the app.
   return (
     <OrgContext.Provider value={{ orgId }}>
        {children}
     </OrgContext.Provider>
   )
}

export { OrgContext };
