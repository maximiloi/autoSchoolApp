import usePdfMake from '@/hooks/use-pdfmake';
import applicationForm from '@/templates/applicationForm';
import { useCallback } from 'react';

export default function ApplicationFormButton({ student }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    try {
      const docDefinition = await applicationForm(student);
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
