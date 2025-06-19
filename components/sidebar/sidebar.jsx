'use client';

import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo } from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar';

import { useCompanyStore, useGroupStore } from '@/store/useStore';

import SidebarCompanyInfo from './sidebar-company-info';
import NavAction from './sidebar-nav-action';
import NavGroups from './sidebar-nav-groups';
import NavUser from './sidebar-nav-user';

export default function AppSidebar() {
  const session = useSession();
  const { setGroups } = useGroupStore();
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
        <NavGroups />
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
