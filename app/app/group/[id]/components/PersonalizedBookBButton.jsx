import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import personalizedBookB from '@/templates/personalizedBookB';

export default function PersonalizedBookBButton({ group }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = personalizedBookB(group);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, group]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !group} className="text-left">
      Индивидуальная книжка вторая страница
    </button>
  );
}
