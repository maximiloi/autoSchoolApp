import { Printer } from 'lucide-react';
import { useCallback } from 'react';

import usePdfMake from '@/hooks/use-pdfmake';

import { Button } from '@/components/ui/button';

import { useCompanyStore } from '@/store/useStore';

import travelSheet from '@/templates/travelSheet';

export default function TravelSheetButton({ date, group, getDaySessions }) {
  const pdfMake = usePdfMake();
  const { company } = useCompanyStore();

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const daySessions = getDaySessions(date);

    const docDefinition = travelSheet(date, group, company, daySessions);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, date, group, company, getDaySessions]);

  return (
    <Button onClick={generatePDF} disabled={!pdfMake}>
      <Printer />
    </Button>
  );
}
