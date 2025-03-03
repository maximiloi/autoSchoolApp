import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';

import BasicContract from '@/documents/BasicContract';

export default function BasicContractButton({ student, group, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = BasicContract(student, group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student, group]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      Договор (Основной)
    </button>
  );
}
