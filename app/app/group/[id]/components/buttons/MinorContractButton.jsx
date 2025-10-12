import usePdfMake from '@/hooks/use-pdfmake';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

import minorContract from '@/templates/minorContract';

export default function MinorContractButton({ student, group, company }) {
  const pdfMake = usePdfMake();
  const { toast } = useToast();

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    try {
      const docDefinition = await minorContract(
        student,
        group,
        company,
        toast,
        process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME,
      );
      if (!docDefinition) return;

      pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    }
  }, [pdfMake, student, group]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      <span className="text-red-500">!</span> Договор (до 18 лет)
    </button>
  );
}
