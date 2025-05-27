import usePdfMake from '@/hooks/use-pdfmake';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

import applicationForm from '@/templates/applicationForm';

export default function ApplicationFormButton({ student }) {
  const pdfMake = usePdfMake();
  const { toast } = useToast();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = applicationForm(student, toast);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      Заявление-анкета
    </button>
  );
}
