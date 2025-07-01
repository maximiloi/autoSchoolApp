import { useCallback } from 'react';
import usePdfMake from '@/hooks/use-pdfmake';
import { Button } from '@/components/ui/button';
import { ClipboardPlus } from 'lucide-react';

import drivingRecord from '@/templates/drivingRecord';

export default function DrivingRecordButton({ group }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = drivingRecord(group);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake]);

  return (
    <Button variant="secondary" onClick={generatePDF} disabled={!pdfMake}>
      <ClipboardPlus /> Анкета для вождения
    </Button>
  );
}
