'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

import SidebarCompanyInfo from './sidebar-company-info';
import NavGroups from './sidebar-nav-groups';
import NavAction from './sidebar-nav-action';
import NavUser from './sidebar-nav-user';

export default function AppSidebar() {
  const [company, setCompany] = useState(null);
  const session = useSession();
  const { toast } = useToast();

  const fetchCompanyData = useCallback(
    async (companyId) => {
      try {
        const companyRes = await fetch(`/api/company/${companyId}`).then((res) => res.json());

        setCompany(companyRes);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные.',
          status: 'error',
        });
      }
    },
    [session, toast],
  );

  useEffect(() => {
    if (session.status === 'authenticated' && session.data?.user?.companyId) {
      fetchCompanyData(session.data.user.companyId);
    }
  }, [session, fetchCompanyData]);

  const user = useMemo(() => session.data?.user || null, [session]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarCompanyInfo name={company?.shortName || 'Добавить компанию'} />
      </SidebarHeader>
      <SidebarSeparator className="my-4" />
      <SidebarContent>
        <NavGroups groups={company?.groups || []} />
        <SidebarSeparator className="my-4 mt-auto" />
        <NavAction />
      </SidebarContent>
      <SidebarSeparator className="my-4" />
      <SidebarFooter>
        <NavUser user={user} companyName={company?.shortName || null} />
      </SidebarFooter>
    </Sidebar>
  );
}
