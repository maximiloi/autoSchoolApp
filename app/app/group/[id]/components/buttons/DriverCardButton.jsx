import usePdfMake from '@/hooks/use-pdfmake';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

import driverCardTemplate from '@/templates/driverCardTemplate';

export default function DriverCardButton({ student, company }) {
  const pdfMake = usePdfMake();
  const { toast } = useToast();

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    try {
      const docDefinition = await driverCardTemplate(student, company, toast);
      if (!docDefinition) return;

      pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    }
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student || !company}>
      Водительская карточка
    </button>
  );
}
