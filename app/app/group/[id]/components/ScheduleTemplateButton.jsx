import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';

import generateScheduleTemplate from '@/templates/ScheduleTemplate';

export default function ScheduleTemplateButton({ group, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = generateScheduleTemplate(group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake]);

  return (
    <Button variant="secondary" onClick={generatePDF} disabled={!pdfMake}>
      <CalendarCheck /> Расписание
    </Button>
  );
}
