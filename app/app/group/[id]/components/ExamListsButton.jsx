import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import usePdfMake from '@/hooks/use-pdfmake';
import { ru } from 'date-fns/locale';
import { TableProperties } from 'lucide-react';
import { useCallback, useState } from 'react';

import examListsTemplate from '@/templates/examLists';

export default function ExamListsButton({ group, company }) {
  const pdfMake = usePdfMake();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [examType, setExamType] = useState('');

  const handleDialogOpenChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedDate(null);
      setExamType('');
    }
  };

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = examListsTemplate(group, company, selectedDate, examType);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
    setDialogOpen(false);
  }, [pdfMake, selectedDate, group, company]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" disabled={!pdfMake}>
          <TableProperties />
          Заявление для экзаменов в ГИБДД
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Укажите тип и дату экзамена</DialogTitle>
          <DialogDescription>для группы №{group.groupNumber}</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Тип экзамена (например, теория)"
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
        />

        <Calendar
          locale={ru}
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          initialFocus
        />
        <DialogFooter>
          <Button onClick={() => setDialogOpen(false)} variant="ghost">
            Отмена
          </Button>
          <Button onClick={generatePDF} disabled={!pdfMake || !selectedDate || !examType}>
            Сформировать заявление
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
