import { BookCopy, BookPlus, LifeBuoy, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const data = {
  navAction: [
    {
      title: 'Добавить ученика',
      url: '/app/create/student/',
      icon: UserRoundPlus,
    },
    {
      title: 'Добавить группу',
      url: '/app/create/group',
      icon: BookPlus,
    },
    {
      title: 'Справочники и шаблоны',
      url: '/app/dictionaries/',
      icon: BookCopy,
    },
    {
      title: 'Поддержка',
      url: ' https://t.me/maximiloi',
      icon: LifeBuoy,
    },
  ],
};

export default function NavAction({ actions = data.navAction, ...props }) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {actions.map((action) => (
            <SidebarMenuItem key={action.title}>
              <SidebarMenuButton asChild size="sm">
                <Link href={action.url}>
                  <action.icon />
                  <span>{action.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
