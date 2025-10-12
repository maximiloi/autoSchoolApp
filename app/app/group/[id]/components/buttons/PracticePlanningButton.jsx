'use client';

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
import usePdfMake from '@/hooks/use-pdfmake';
import { addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { NotebookPen } from 'lucide-react';
import { useCallback, useState } from 'react';

import practicePlanning from '@/templates/practicePlanning';

export default function PracticePlanningButton({ group }) {
  const { startTrainingDate, endTrainingDate, id: groupId, groupNumber } = group;
  const pdfMake = usePdfMake();
  const [dialogOpen, setDialogOpen] = useState(false);

  const toLocalDateString = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0]; // 'yyyy-MM-dd'
  };

  const fetchSessions = useCallback(async () => {
    const query = new URLSearchParams({
      groupId,
      startDate: toLocalDateString(startTrainingDate),
      endDate: toLocalDateString(endTrainingDate),
    });

    try {
      const res = await fetch(`/api/driving-sessions/by-range?${query}`);
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Ошибка запроса:', err);
      return null;
    }
  }, [groupId, startTrainingDate, endTrainingDate]);

  const getNextSunday = () => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilSunday = (7 - day) % 7 || 7;
    return addDays(today, daysUntilSunday);
  };

  const [selectedDate, setSelectedDate] = useState(getNextSunday());

  const generatePDF = useCallback(async () => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const sessions = await fetchSessions();
    if (!sessions) return;

    const docDefinition = practicePlanning(group, selectedDate, sessions);
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
          <DialogDescription>для группы № {groupNumber}</DialogDescription>
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
