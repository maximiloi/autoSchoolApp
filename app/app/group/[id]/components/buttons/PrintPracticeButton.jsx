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
import { Printer } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import practiceSchedule from '@/templates/practiceSchedule';

export default function PrintPracticeButton({ group }) {
  const { groupNumber, id: groupId } = group;
  const pdfMake = usePdfMake();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [forWebsite, setForWebsite] = useState(false);
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(false);

  const toLocalDateString = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0]; // 'yyyy-MM-dd'
  };

  const fetchSessions = useCallback(
    async (startDate) => {
      if (!startDate) return;

      const endDate = addDays(startDate, 13);
      const query = new URLSearchParams({
        groupId,
        startDate: toLocalDateString(startDate),
        endDate: toLocalDateString(endDate),
      });

      setLoading(true);
      try {
        const res = await fetch(`/api/driving-sessions/by-range?${query}`);
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error('Ошибка запроса:', err);
        setSessions(null);
      } finally {
        setLoading(false);
      }
    },
    [groupId],
  );

  useEffect(() => {
    if (selectedDate) {
      fetchSessions(selectedDate);
    }
  }, [selectedDate, fetchSessions]);

  const generatePDF = useCallback(() => {
    if (!pdfMake || !sessions) return;

    const docDefinition = practiceSchedule(group, selectedDate, sessions, forWebsite);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
    setDialogOpen(false);
  }, [pdfMake, group, selectedDate, sessions, forWebsite]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Printer /> Печать графика практики
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Выберите дату начала печати графика практики</DialogTitle>
          <DialogDescription>для группы № {groupNumber}</DialogDescription>
        </DialogHeader>
        <Calendar
          locale={ru}
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          initialFocus
        />
        <Label className="flex cursor-pointer items-center gap-4">
          <Switch checked={forWebsite} onCheckedChange={(checked) => setForWebsite(checked)} />
          Создать график для сайта
        </Label>
        <DialogFooter>
          <Button onClick={() => setDialogOpen(false)} variant="ghost">
            Отмена
          </Button>
          <Button onClick={generatePDF} disabled={!pdfMake || !sessions || loading}>
            {loading ? 'Загрузка данных...' : 'Сформировать график'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
