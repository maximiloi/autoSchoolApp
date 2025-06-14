import { Printer } from 'lucide-react';
import { useCallback } from 'react';

import usePdfMake from '@/hooks/use-pdfmake';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';

import { useCompanyStore } from '@/store/useStore';

import travelSheet from '@/templates/travelSheet';

export default function TravelSheetButton({ date, group, getDaySessions, saveSessions }) {
  const pdfMake = usePdfMake();
  const { company } = useCompanyStore();
  const { toast } = useToast();

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    try {
      await saveSessions();
    } catch (error) {
      toast({ variant: 'destructive', description: `Ошибка при сохранении: ${error.message}` });
      throw error;
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
