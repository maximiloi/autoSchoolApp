import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import { Button } from '@/components/ui/button';

import generateScheduleTemplate from '@/templates/ScheduleTemplate';

export default function ScheduleTemplateButton() {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = generateScheduleTemplate();
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake]);

  return (
    <Button variant="outline" onClick={generatePDF} disabled={!pdfMake}>
      Расписание
    </Button>
  );
}
