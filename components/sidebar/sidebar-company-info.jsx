import Link from 'next/link';
import { Car } from 'lucide-react';

export default function SidebarCompanyInfo({ name }) {
  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Car className="size-4" />
      </div>
      <div className="text-l grid flex-1 text-left leading-tight">
        <span className="truncate font-semibold">
          <Link href="/app/company/">{name}</Link>
        </span>
      </div>
    </>
  );
}
