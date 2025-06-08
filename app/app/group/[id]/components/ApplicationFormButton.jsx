import usePdfMake from '@/hooks/use-pdfmake';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

import applicationForm from '@/templates/applicationForm';

export default function ApplicationFormButton({ student }) {
  const pdfMake = usePdfMake();
  const { toast } = useToast();

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    try {
      const docDefinition = await applicationForm(
        student,
        toast,
        process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME,
      );
      if (!docDefinition) return;

      pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
    }
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      Заявление-анкета
    </button>
  );
}
