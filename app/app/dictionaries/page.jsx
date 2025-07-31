import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    </>
  );
}
