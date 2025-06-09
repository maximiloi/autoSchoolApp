import { addDays, format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function journeyPracticeSchedule(group = {}, selectedDate, sessions = []) {
  if (!selectedDate) return null;

  const { startTrainingDate, endTrainingDate, groupNumber, students = [] } = group;

  const startDate = new Date(startTrainingDate);
  const endDate = new Date(endTrainingDate);

  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const formatDate = (date) => format(date, 'dd.MM.yy', { locale: ru });

  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const dateColumns = Array.from({ length: totalDays }, (_, i) => {
    const date = addDays(startDate, i);
    return { date, text: formatDate(date) };
  });

  const sortedStudents = [...students].sort((a, b) => a.studentNumber - b.studentNumber);

  const sessionMap = new Map();
  for (const student of sortedStudents) {
    const count = sessions.filter((s) => s.studentId === student.id).length;
    sessionMap.set(student.id, count);
  }

  const columnDistribution = [25, 27, 31]; // ← Меняй этот массив по желанию

  const columnChunks = [];
  let currentIndex = 0;
  for (const count of columnDistribution) {
    if (currentIndex >= dateColumns.length) break;
    const chunk = dateColumns.slice(currentIndex, currentIndex + count);
    columnChunks.push(chunk);
    currentIndex += count;
  }

  const buildTable = (columns, options = { showTotalHours: false }) => {
    const { showTotalHours } = options;
    const widths = ['3.5%', '19%', ...(showTotalHours ? ['5%'] : []), ...columns.map(() => 13)];

    const header = [
      { text: '№ п/п', style: 'tableHeader' },
      { text: 'Фамилия Имя учащегося', style: 'tableHeader' },
      ...(showTotalHours ? [{ text: 'Всего часов', style: 'tableHeader' }] : []),
      ...columns.map((col) => ({
        text: col.text,
        alignment: 'center',
        fontSize: 8,
        bold: true,
        margin: [0, 1, 0, 1],
      })),
    ];

    const body = sortedStudents.map((student) => {
      const baseRow = [
        { text: student.studentNumber, alignment: 'center' },
        { text: `${student.lastName} ${student.firstName}`, style: 'table' },
      ];

      if (showTotalHours) {
        baseRow.push({
          text: `${sessionMap.get(student.id) * 2}`,
          alignment: 'center',
          fontSize: 12,
        });
      }

      const sessionCells = columns.map((col) => {
        const match = sessions.find(
          (s) =>
            s.studentId === student.id &&
            normalizeDate(parseISO(s.date)) === normalizeDate(col.date),
        );
        return match
          ? { text: '2', alignment: 'center', fontSize: 12 }
          : { text: '', alignment: 'center' };
      });

      return [...baseRow, ...sessionCells];
    });

    return {
      style: 'tableStudents',
      margin: [0, 20, 0, 0],
      fontSize: 10,
      table: {
        headerRows: 1,
        widths,
        body: [header, ...body],
      },
    };
  };

  return {
    pageOrientation: 'landscape',
    styles: {
      header: { fontSize: 22, bold: true, alignment: 'center' },
      subHeader: { fontSize: 16, alignment: 'center' },
      tableHeader: { fontSize: 10, alignment: 'center', bold: true },
      table: { fontSize: 12 },
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
      ...columnChunks.map((chunk, index) => ({
        ...buildTable(chunk, { showTotalHours: index === 0 }),
        ...(index > 0 ? { pageBreak: 'before' } : {}),
      })),
    ],
  };
}
