import { Button } from '@/components/ui/button';
import usePdfMake from '@/hooks/use-pdfmake';
import registerNewGroup from '@/templates/registerNewGroup';
import { FileText } from 'lucide-react';
import { useCallback } from 'react';

export default function ApplicationRegisterNewGroupButton({ group, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = registerNewGroup(group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, group]);

  return (
    <Button variant="secondary" onClick={generatePDF} disabled={!pdfMake}>
      <FileText />
      Заявление о новой группе
    </Button>
  );
}
