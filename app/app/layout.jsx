'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

import AppSidebar from '@/components/sidebar/sidebar';

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                {pathSegments.map((segment, index) => {
                  const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                  const isLast = index === pathSegments.length - 1;

                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href={href}>
                            {segment.charAt(0).toUpperCase() + segment.slice(1)}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <section className="px-4 py-4">{children}</section>
      </SidebarInset>
    </SidebarProvider>
  );
}
