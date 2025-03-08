import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollText } from 'lucide-react';
import ScheduleTemplateButton from './ScheduleTemplateButton';

export default function FooterPage({ group, company }) {
  return (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <Button variant="secondary">
        <ScrollText /> Путевой лист
      </Button>
      <Separator orientation="vertical" />
      <ScheduleTemplateButton group={group} company={company} />
    </div>
  );
}
