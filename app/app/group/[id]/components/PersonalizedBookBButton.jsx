import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import personalizedBookB from '@/templates/personalizedBookB';

export default function PersonalizedBookBButton({ student }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = personalizedBookB(student);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student} className="text-left">
      Индивидуальная книжка вторая страница
    </button>
  );
}
