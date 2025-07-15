import { BookUser, ChevronRight, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import { useGroupStore } from '@/store/useStore';

function GroupList({ groups, title, icon: Icon }) {
  const pathname = usePathname();

  if (groups.length === 0) return null;

  return (
    <Collapsible asChild defaultOpen={title === 'Активные группы'} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            <Icon />
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {groups.map((group) => {
              const groupPath = `/app/group/${group.id}`;
              const isActive = pathname === groupPath;

              return (
                <SidebarMenuSubItem key={group.id}>
                  <SidebarMenuSubButton asChild isActive={isActive}>
                    <Link href={`/app/group/${group.id}`}>
                      <span>Группа № {group.groupNumber}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export default function NavGroups() {
  const { groups } = useGroupStore();

  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => a.groupNumber - b.groupNumber);
  }, [groups]);

  const activeGroups = useMemo(() => sortedGroups.filter((g) => g.isActive), [sortedGroups]);
  const archivedGroups = useMemo(() => sortedGroups.filter((g) => !g.isActive), [sortedGroups]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Группы</SidebarGroupLabel>
      <SidebarMenu>
        <GroupList groups={activeGroups} title="Активные группы" icon={UsersRound} />
        <GroupList groups={archivedGroups} title="Архивные группы" icon={BookUser} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
