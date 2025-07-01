'use client';

import { Printer } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';

import usePdfMake from '@/hooks/use-pdfmake';

import journeyPracticeSchedule from '@/templates/journeyPracticeSchedule';

export default function JourneyPracticeButton({ group }) {
  const { startTrainingDate, endTrainingDate, id: groupId } = group;
  const pdfMake = usePdfMake();
  const [loading, setLoading] = useState(false);

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

  const generatePDF = useCallback(async () => {
    if (!pdfMake) return;
    setLoading(true);

    const sessions = await fetchSessions();
    setLoading(false);
    if (!sessions) return;

    const docDefinition = journeyPracticeSchedule(group, startTrainingDate, sessions);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, group, startTrainingDate, fetchSessions]);

  return (
    <Button variant="secondary" onClick={generatePDF} disabled={!pdfMake || loading}>
      {loading ? (
        'Загрузка...'
      ) : (
        <>
          <Printer /> График практического вождения
        </>
      )}
    </Button>
  );
}
