import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

import AppSidebar from '@/components/sidebar/sidebar';

export async function generateMetadata() {
  const session = await getServerSession(authOptions);
  const companyId = session?.user?.companyId;

  let companyName = '! Необходимо добавить данные о Вашей компании';

  if (companyId) {
    try {
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/company/${companyId}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }

      const company = await response.json();
      companyName = company?.shortName || companyName;
    } catch (error) {
      console.error('Ошибка загрузки данных о компании:', error);
    }
  }

  return {
    title: `${companyName} | АвтошколаApp`,
    description: `Рабочая панель компании ${companyName} | АвтошколаApp`,
  };
}

export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
          </header>
          <section className="px-4 py-4">{children}</section>
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
