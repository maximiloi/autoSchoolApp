import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import { Button } from '@/components/ui/button';

import scheduleTemplate from '@/templates/scheduleTemplate';

export default function ScheduleTemplateButton() {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = scheduleTemplate();
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake]);

  return (
    <Button variant="outline" onClick={generatePDF} disabled={!pdfMake}>
      Расписание
    </Button>
  );
}
