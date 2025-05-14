import { Button } from '@/components/ui/button';
import usePdfMake from '@/hooks/use-pdfmake';
import travelSheet from '@/templates/travelSheet';
import { Printer } from 'lucide-react';
import { useCallback } from 'react';

export default function TravelSheetButton({ date, group, company, daySessions }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = travelSheet(date, group, company, daySessions);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake]);

  return (
    <Button onClick={generatePDF} disabled={!pdfMake}>
      <Printer />
    </Button>
  );
}
