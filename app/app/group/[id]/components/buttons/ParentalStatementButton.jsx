import { useCallback } from 'react';

import usePdfMake from '@/hooks/use-pdfmake';
import { useToast } from '@/hooks/use-toast';

import parentalStatement from '@/templates/parentalStatement';

export default function ParentalStatementButton({ student }) {
  const pdfMake = usePdfMake();
  const { toast } = useToast();

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

    const docDefinition = parentalStatement(student, toast, gibddData);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      <span className="text-red-500">!</span> Согласие от родителей
    </button>
  );
}
