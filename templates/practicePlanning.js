import { addDays, format, getDay } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function practicePlanning(group = {}, selectedDate, sessions = []) {
  const { groupNumber, students = [] } = group;

  if (!selectedDate) return null;

  const startDate = new Date(selectedDate);
  const endDate = addDays(startDate, 13);

  const activeGroupNumber = groupNumber ?? '_____';
  const activeSelectedTrainingDate = format(startDate, 'dd.MM.yyyy', { locale: ru });
  const activeEndTrainingDate = format(endDate, 'dd.MM.yyyy', { locale: ru });

  const dateColumns = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startDate, i);
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return {
      text: format(date, 'dd.MM (EEE)', { locale: ru }),
      isWeekend,
      date,
    };
  });

  const sortedStudents = [...students].sort((a, b) => a.studentNumber - b.studentNumber);

  const sessionMap = new Map();
  for (const student of sortedStudents) {
    const count = sessions.filter((s) => s.studentId === student.id).length;
    sessionMap.set(student.id, count);
  }

  const widths = ['3.5%', '19%', '5%', ...Array(14).fill('*')];

  return {
    pageOrientation: 'landscape',
    styles: {
      header: { fontSize: 22, bold: true, alignment: 'center' },
      subHeader: { fontSize: 16, alignment: 'center' },
      tableHeader: { fontSize: 9, alignment: 'center', bold: true },
      table: { fontSize: 10 },
    },
    content: [
      { text: 'Планирование практики', style: 'header' },
      {
        text: `Учебной группы № ${activeGroupNumber}`,
        style: 'subHeader',
      },
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
          widths,
          body: [
            [
              { text: '№ п/п', style: 'tableHeader' },
              { text: 'ФИО / Телефон', style: 'tableHeader' },
              { text: 'Всего часов', style: 'tableHeader' },
              ...dateColumns.map((col) => ({
                text: col.text,
                style: 'tableHeader',
                fillColor: col.isWeekend ? '#d2d4da' : null,
              })),
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              {
                text: `${student.lastName} ${student.firstName} ${student.middleName ?? ''}\n${student.phone}`,
                style: 'table',
              },
              {
                text: `${sessionMap.get(student.id) * 2}`,
                alignment: 'center',
                fontSize: 10,
              },
              ...dateColumns.map((col) => ({
                text: '',
                fillColor: col.isWeekend ? '#d2d4da' : null,
              })),
            ]),
          ],
        },
      },
    ],
  };
}
