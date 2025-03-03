import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import PersonalizedBookA from '@/documents/PersonalizedBookA';

export default function PersonalizedBookAButton({ student, group, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = PersonalizedBookA(student, group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student} className="text-left">
      Индивидуальная книжка первая страница
    </button>
  );
}
