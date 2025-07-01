import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import { Button } from '@/components/ui/button';
import { Notebook } from 'lucide-react';

import journeyTemplate from '@/templates/journeyTemplate';

export default function JourneyTemplateButton({ group, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = journeyTemplate(group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake]);

  return (
    <Button variant="secondary" onClick={generatePDF} disabled={!pdfMake}>
      <Notebook /> Журнал
    </Button>
  );
}
