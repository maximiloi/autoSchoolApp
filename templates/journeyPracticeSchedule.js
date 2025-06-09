import { addDays, format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function journeyPracticeSchedule(group = {}, selectedDate, sessions = []) {
  if (!selectedDate) return null;

  const { startTrainingDate, endTrainingDate, groupNumber, students = [] } = group;

  const startDate = new Date(startTrainingDate);
  const endDate = new Date(endTrainingDate);

  const formatDate = (date) => format(date, 'dd MM yy', { locale: ru });
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const dateColumns = Array.from({ length: totalDays }, (_, i) => {
    const date = addDays(startDate, i);
    return { date, text: formatDate(date) };
  });

  const sortedStudents = [...students].sort((a, b) => a.studentNumber - b.studentNumber);

  const chunkSize = 30;
  const allChunks = [];
  for (let i = 0; i < dateColumns.length; i += chunkSize) {
    allChunks.push(dateColumns.slice(i, i + chunkSize));
  }

  const baseHeaders = [
    { text: '№ п/п', style: 'tableHeader' },
    { text: 'Фамилия Имя учащегося', style: 'tableHeader' },
    { text: 'Всего часов', style: 'tableHeader' },
  ];

  const baseWidths = ['3.5%', '15%', '5%'];

  const buildTable = (columns) => ({
    style: 'tableStudents',
    margin: [0, 20, 0, 0],
    fontSize: 8,
    table: {
      headerRows: 1,
      widths: [...baseWidths, ...Array(columns.length).fill(10)],
      body: [
        [
          ...baseHeaders,
          ...columns.map((col) => ({
            text: col.text,
            alignment: 'center',
            fontSize: 8,
            bold: true,
          })),
        ],
        ...sortedStudents.map((student) => {
          let sessionCount = 0;

          const sessionCells = columns.map((col) => {
            const match = sessions.find(
              (s) =>
                s.studentId === student.id &&
                normalizeDate(parseISO(s.date)) === normalizeDate(col.date),
            );
            if (match) {
              sessionCount += 1;
              return { text: '2', alignment: 'center', fontSize: 12 };
            }
            return { text: '', alignment: 'center' };
          });

          return [
            { text: student.studentNumber, alignment: 'center' },
            { text: `${student.lastName} ${student.firstName}`, style: 'table' },
            { text: `${sessionCount * 2}`, alignment: 'center', fontSize: 12 },
            ...sessionCells,
          ];
        }),
      ],
    },
  });

  const tables = allChunks.map((chunk, index) => {
    const table = buildTable(chunk);
    return index === 0 ? table : { ...table, pageBreak: 'before' };
  });

  return {
    pageOrientation: 'landscape',
    styles: {
      header: { fontSize: 22, bold: true, alignment: 'center' },
      subHeader: { fontSize: 16, alignment: 'center' },
      tableHeader: { fontSize: 9, alignment: 'center', bold: true },
      table: { fontSize: 10 },
    },
    content: [
      { text: 'График учета обучения практического вождения ', style: 'header' },
      { text: `Учебной группы № ${groupNumber ?? '_____'}`, style: 'subHeader' },
      {
        text: `на период с ${format(startDate, 'dd.MM.yyyy', { locale: ru })} до ${format(
          endDate,
          'dd.MM.yyyy',
          { locale: ru },
        )}`,
        style: 'subHeader',
      },
      ...tables,
    ],
  };
}
