import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';

import informationForTrafficPoliceTemplate from '@/templates/informationForTrafficPolice';

export default function InformationForTrafficPoliceButton({ group, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = informationForTrafficPoliceTemplate(group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake]);

  return (
    <Button variant="secondary" onClick={generatePDF} disabled={!pdfMake}>
      <ClipboardList /> Сведенья для ГИБДД
    </Button>
  );
}
