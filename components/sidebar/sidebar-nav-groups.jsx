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
import { BookUser, ChevronRight, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

function GroupList({ groups, title, icon: Icon }) {
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
            {groups.map((group) => (
              <SidebarMenuSubItem key={group.id}>
                <SidebarMenuSubButton asChild>
                  <Link href={`/app/group/${group.id}`}>
                    <span>Группа № {group.groupNumber}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export default function NavGroups() {
  const { groups } = useGroupStore();

  const activeGroups = useMemo(() => groups.filter((g) => g.isActive), [groups]);
  const archivedGroups = useMemo(() => groups.filter((g) => !g.isActive), [groups]);

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
