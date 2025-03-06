'use client';

import { useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useCompanyStore, useGroupStore } from '@/store/useStore';
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
  const session = useSession();
  const { groups, setGroups } = useGroupStore();
  const { company, setCompany } = useCompanyStore();
  const { toast } = useToast();

  const user = useMemo(() => session.data?.user || null, [session]);

  useEffect(() => {
    if (company.id || session.status !== 'authenticated' || !session.data?.user?.companyId) return;

    async function fetchCompanyData(companyId) {
      try {
        const response = await fetch(`/api/company/${companyId}`);
        const companyData = await response.json();
        setCompany(companyData);
        setGroups(companyData.groups || []);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные.',
          status: 'error',
        });
      }
    }

    fetchCompanyData(session.data.user.companyId);
  }, [session, setGroups, company]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarCompanyInfo name={company.shortName || 'Добавить компанию'} />
      </SidebarHeader>
      <SidebarSeparator className="my-4" />
      <SidebarContent>
        <NavGroups groups={groups} />
        <SidebarSeparator className="my-4 mt-auto" />
        <NavAction />
      </SidebarContent>
      <SidebarSeparator className="my-4" />
      <SidebarFooter>
        <NavUser user={user} companyName={company.shortName || null} />
      </SidebarFooter>
    </Sidebar>
  );
}
