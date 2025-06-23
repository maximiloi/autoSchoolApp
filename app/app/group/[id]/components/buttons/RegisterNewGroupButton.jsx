import { FileText } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';

import usePdfMake from '@/hooks/use-pdfmake';
import { toast } from '@/hooks/use-toast';

import registerNewGroup from '@/templates/registerNewGroup';

export default function RegisterNewGroupButton({ group, company }) {
  const pdfMake = usePdfMake();

  async function fetchGibddData() {
    try {
      const response = await fetch('/api/gibdd');
      const gibddData = await response.json();
      if (response.ok) {
        return gibddData;
      } else {
        throw new Error('Не удалось загрузить данные ГИБДД');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные ГИБДД.',
        variant: 'destructive',
      });
      console.error('Ошибка при загрузке данных ГИБДД:', error);
      return null;
    }
  }

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const gibddData = await fetchGibddData();
    if (!gibddData) {
      return;
    }

    const docDefinition = registerNewGroup(group, company, gibddData);
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
