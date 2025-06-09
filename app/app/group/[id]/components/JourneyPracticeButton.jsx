'use client';

import { Button } from '@/components/ui/button';
import usePdfMake from '@/hooks/use-pdfmake';
import { Printer } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import journeyPracticeSchedule from '@/templates/journeyPracticeSchedule';

export default function JourneyPracticeButton({ group }) {
  const { startTrainingDate, endTrainingDate, id: groupId } = group;
  const pdfMake = usePdfMake();
  const [sessions, setSessions] = useState(null);

  const toLocalDateString = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0]; // 'yyyy-MM-dd'
  };

  const fetchSessions = useCallback(
    async (startDate) => {
      if (!startDate) return;

      const query = new URLSearchParams({
        groupId,
        startDate: toLocalDateString(startTrainingDate),
        endDate: toLocalDateString(endTrainingDate),
      });

      try {
        const res = await fetch(`/api/driving-sessions/by-range?${query}`);
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        setSessions(data);
      } catch (err) {
        console.error('Ошибка запроса:', err);
        setSessions(null);
      }
    },
    [groupId],
  );

  useEffect(() => {
    if (startTrainingDate) {
      fetchSessions(startTrainingDate);
    }
  }, [startTrainingDate, fetchSessions]);

  const generatePDF = useCallback(() => {
    if (!pdfMake || !sessions) return;

    const docDefinition = journeyPracticeSchedule(group, startTrainingDate, sessions);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, group, startTrainingDate, sessions]);

  return (
    <Button variant="secondary" onClick={generatePDF} disabled={!pdfMake}>
      <Printer /> График практического вождения
    </Button>
  );
}
