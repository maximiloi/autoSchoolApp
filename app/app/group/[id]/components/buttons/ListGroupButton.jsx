import { Button } from '@/components/ui/button';
import usePdfMake from '@/hooks/use-pdfmake';
import { List } from 'lucide-react';
import { useCallback } from 'react';

import listGroup from '@/templates/listGroup';

export default function ListGroupButton({ group, company }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = listGroup(group, company);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, group]);

  return (
    <Button variant="secondary" onClick={generatePDF} disabled={!pdfMake || !group || !company}>
      <List /> Список группы
    </Button>
  );
}
