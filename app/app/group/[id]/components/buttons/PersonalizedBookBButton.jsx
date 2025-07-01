import { useCallback } from 'react';

import usePdfMake from '@/hooks/use-pdfmake';

import personalizedBookB from '@/templates/personalizedBookB';

export default function PersonalizedBookBButton({ group, student }) {
  const { startTrainingDate, endTrainingDate } = group;
  const { id: studentId } = student;
  const pdfMake = usePdfMake();

  const toLocalDateString = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0]; // 'yyyy-MM-dd'
  };

  const fetchStudentSessions = useCallback(async () => {
    const query = new URLSearchParams({
      studentId,
      startDate: toLocalDateString(startTrainingDate),
      endDate: toLocalDateString(endTrainingDate),
    });

    try {
      const res = await fetch(`/api/driving-sessions/by-student?${query}`);
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Ошибка запроса:', err);
      return null;
    }
  }, [studentId, startTrainingDate, endTrainingDate]);

  const generatePDF = useCallback(async () => {
    if (!pdfMake) return;

    const sessions = await fetchStudentSessions();
    if (!sessions) return;

    const docDefinition = personalizedBookB(group, sessions);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, group, startTrainingDate, fetchStudentSessions]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !group} className="text-left">
      Индивидуальная книжка вторая страница
    </button>
  );
}
