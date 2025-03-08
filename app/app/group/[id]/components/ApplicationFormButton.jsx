import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import generateApplicationForm from '@/templates/ApplicationForm';

export default function ApplicationFormButton({ student }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = generateApplicationForm(student);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      Заявление-анкета
    </button>
  );
}
