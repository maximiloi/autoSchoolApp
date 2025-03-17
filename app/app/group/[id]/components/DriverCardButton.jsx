import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import driverCardTemplate from '@/templates/driverCardTemplate';

export default function DriverCardButton({ student, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = driverCardTemplate(student, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student || !company}>
      Водительская карточка
    </button>
  );
}
