import { addDays, format, getDay, isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function practiceSchedule(group = {}, selectedDate, sessions = []) {
  console.log('🚀 ~ practiceSchedule ~ sessions:', sessions);
  const { groupNumber, students = [], practiceTeachers = [] } = group;

  if (!selectedDate) return null;

  const startDate = new Date(selectedDate);
  const endDate = addDays(startDate, 13);

  const activeGroupNumber = groupNumber ?? '_____';
  const activeSelectedTrainingDate = format(startDate, 'dd.MM.yyyy', { locale: ru });
  const activeEndTrainingDate = format(endDate, 'dd.MM.yyyy', { locale: ru });

  const dateColumns = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startDate, i);
    const dayOfWeek = getDay(date);
    return {
      date,
      text: format(date, 'dd.MM (EEE)', { locale: ru }),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    };
  });

  const sortedStudents = [...students].sort((a, b) => a.studentNumber - b.studentNumber);

  const practiceTeachersBlock =
    practiceTeachers.length > 0
      ? [
          {
            text: 'Преподаватели практики:',
            margin: [0, 20, 0, 5],
            bold: true,
            fontSize: 12,
          },
          ...practiceTeachers.map((t) => ({
            text: `${t.lastName} ${t.firstName} ${t.middleName ?? ''}\n${t.phone}`,
            fontSize: 16,
            margin: [0, 0, 0, 5],
          })),
        ]
      : [];

  return {
    pageOrientation: 'landscape',
    styles: {
      header: { fontSize: 22, bold: true, alignment: 'center' },
      subHeader: { fontSize: 16, alignment: 'center' },
      tableHeader: { fontSize: 9, alignment: 'center', bold: true },
      table: { fontSize: 10 },
    },
    content: [
      { text: 'График практики', style: 'header' },
      { text: `Учебной группы № ${activeGroupNumber}`, style: 'subHeader' },
      {
        text: `на период с ${activeSelectedTrainingDate} до ${activeEndTrainingDate}`,
        style: 'subHeader',
      },
      {
        style: 'tableStudents',
        margin: [0, 10, 0, 0],
        fontSize: 8,
        table: {
          headerRows: 1,
          widths: ['3.5%', '22%', ...Array(14).fill('*')],
          body: [
            [
              { text: '№ п/п', style: 'tableHeader' },
              { text: 'ФИО', style: 'tableHeader' },
              ...dateColumns.map((col) => ({
                text: col.text,
                style: 'tableHeader',
                fillColor: col.isWeekend ? '#d2d4da' : null,
              })),
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              {
                text: `${student.lastName} ${student.firstName} ${student.middleName ?? ''}`,
                style: 'table',
              },
              ...dateColumns.map((col) => {
                const matchingSession = sessions.find((s) => {
                  const sessionDate = addDays(parseISO(s.date), 1);
                  return s.studentId === student.id && isSameDay(sessionDate, col.date);
                });

                return {
                  text: matchingSession?.slot || '',
                  alignment: 'center',
                  fontSize: 12,
                  fillColor: col.isWeekend ? '#d2d4da' : null,
                };
              }),
            ]),
          ],
        },
      },
      ...practiceTeachersBlock,
    ],
  };
}
