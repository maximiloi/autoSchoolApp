import usePdfMake from '@/hooks/use-pdfmake';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

import basicContract from '@/templates/basicContract';

export default function BasicContractButton({ student, group, company }) {
  const pdfMake = usePdfMake();
  const { toast } = useToast();

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    try {
      const docDefinition = await basicContract(student, group, company);
      if (!docDefinition) return;

      pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    }
  }, [pdfMake, student, group]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      Договор (Основной)
    </button>
  );
}
