'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

import ScheduleTemplateButton from './components/ScheduleTemplateButton';

export default function Dictionaries() {
  return (
    <>
      <h2>Справочники</h2>
      <div className="mt-6 flex gap-4">
        <Button>
          <Link href={'/app/company/'}>Моя компания</Link>
        </Button>
        <Button>
          <Link href={'/app/police/'}>Реквизиты ГИБДД</Link>
        </Button>
      </div>
      <h2 className="mt-6">Шаблоны</h2>
      <div className="mt-6 flex gap-4">
        <ScheduleTemplateButton />
      </div>
    </>
  );
}
