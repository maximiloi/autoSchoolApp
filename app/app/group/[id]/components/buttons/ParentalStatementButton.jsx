import usePdfMake from '@/hooks/use-pdfmake';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';

import parentalStatement from '@/templates/parentalStatement';

export default function ParentalStatementButton({ student }) {
  const pdfMake = usePdfMake();
  const { toast } = useToast();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = parentalStatement(student, toast);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      <span className="text-red-500">!</span> Согласие от родителей
    </button>
  );
}
