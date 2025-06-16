import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import personalizedBookA from '@/templates/personalizedBookA';

export default function PersonalizedBookAButton({ student, group, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = personalizedBookA(student, group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student} className="text-left">
      Индивидуальная книжка первая страница
    </button>
  );
}
