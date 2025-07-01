'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import AppSidebar from '@/components/sidebar/sidebar';

export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <section className="px-4 py-4">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  );
}
