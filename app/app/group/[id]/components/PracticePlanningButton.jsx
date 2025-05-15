'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import usePdfMake from '@/hooks/use-pdfmake';
import practicePlanning from '@/templates/practicePlanning';
import { addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { NotebookPen } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function PracticePlanningButton({ group }) {
  const pdfMake = usePdfMake();
  const [dialogOpen, setDialogOpen] = useState(false);

  const getNextSunday = () => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilSunday = (7 - day) % 7 || 7;
    return addDays(today, daysUntilSunday);
  };

  const [selectedDate, setSelectedDate] = useState(getNextSunday());

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = practicePlanning(group, selectedDate);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
    setDialogOpen(false);
  }, [pdfMake, group, selectedDate]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <NotebookPen /> Планирование практики
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Выберите дату начала практики</DialogTitle>
        </DialogHeader>
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
          <Button onClick={generatePDF} disabled={!pdfMake}>
            Сформировать документ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
