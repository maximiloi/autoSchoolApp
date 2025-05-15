import { addDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function practicePlanning(group = {}, selectedDate) {
  const { groupNumber, students = [] } = group;

  if (!selectedDate) return null;

  const startDate = new Date(selectedDate);
  const endDate = addDays(startDate, 13); // +14 дней — с учетом включительно

  const activeGroupNumber = groupNumber ?? '_____';
  const activeSelectedTrainingDate = format(startDate, 'dd.MM.yyyy', { locale: ru });
  const activeEndTrainingDate = format(endDate, 'dd.MM.yyyy', { locale: ru });

  const dateHeaders = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(startDate, i);
    return format(date, 'dd.MM (EEE)', { locale: ru });
  });

  const sortedStudents = [...students].sort((a, b) => a.studentNumber - b.studentNumber);

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
          widths: ['3.5%', '22%', ...Array(14).fill('*')],
          body: [
            [
              { text: '№ п/п', style: 'tableHeader' },
              { text: 'ФИО / Телефон', style: 'tableHeader' },
              ...dateHeaders.map((d) => ({ text: d, style: 'tableHeader' })),
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              {
                text: `${student.lastName} ${student.firstName} ${student.middleName ?? ''}\n${student.phone}`,
                style: 'table',
              },
              ...Array(14).fill({ text: '' }), // Пустые ячейки
            ]),
          ],
        },
      },
    ],
  };
}
