import Link from 'next/link';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserRoundPlus, BookPlus, BookCopy, LifeBuoy } from 'lucide-react';

const data = {
  navAction: [
    {
      title: 'Добавить ученика',
      url: '/app/student/',
      icon: UserRoundPlus,
    },
    {
      title: 'Добавить группу',
      url: '/app/group/',
      icon: BookPlus,
    },
    {
      title: 'Справочники',
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
