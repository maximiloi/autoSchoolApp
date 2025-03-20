import { MERGED_SCHEDULE } from '@/lib/MERGED_SCHEDULE';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function scheduleTemplate(group = { theoryTeachers: [{}] }, company = {}) {
  const { directorSurname = '-', directorName = '-', directorPatronymic = '-' } = company;
  const {
    groupNumber,
    startTrainingDate,
    endTrainingDate,
    theoryTeachers: [{ lastName = '-', firstName = '-', middleName = '-' }],
  } = group;

  const fullNameDirector =
    directorSurname !== '-' && directorName !== '-'
      ? `${directorSurname} ${directorName[0]}. ${directorPatronymic[0] || ''}.`.trim()
      : '___________________';

  const fullNameTeacher =
    lastName !== '-' && firstName !== '-'
      ? `${lastName} ${firstName[0]}. ${middleName[0] || ''}.`.trim()
      : '';

  const activeGroupNumber = groupNumber || '_____';
  const activeStartTrainingDate = startTrainingDate
    ? format(new Date(startTrainingDate), 'dd/MM/yyyy', { locale: ru })
    : '____/____/________';
  const activeEndTrainingDate = endTrainingDate
    ? format(new Date(endTrainingDate), 'dd/MM/yyyy', { locale: ru })
    : '____/____/________';

  let currentDate = new Date(startTrainingDate);
  const tableBody = [
    [
      { text: '№ занятия', style: 'tableHeader' },
      { text: 'Дата (день / месяц)', style: 'tableHeader' },
      { text: 'Часы начала занятия', style: 'tableHeader' },
      { text: 'Преподаватель', style: 'tableHeader' },
      { text: 'Наименование учебного предмета', style: 'tableHeader' },
      { text: 'Номера и наименование тем занятий', style: 'tableHeader' },
      { text: 'Кол-во часов', style: 'tableHeader' },
      { text: 'Итого часов', style: 'tableHeader' },
    ],
  ];

  let totalHoursSum = 0;

  MERGED_SCHEDULE.forEach((lesson) => {
    while (![0, 3, 6].includes(currentDate.getDay())) {
      currentDate = addDays(currentDate, 1);
    }
    const formattedDate = format(currentDate, 'dd/MM', { locale: ru });
    currentDate = addDays(currentDate, 1);

    let isFirstRow = true;
    let lastTheme = '';
    totalHoursSum += lesson.totalHours;

    lesson.topics.forEach((topic, index, array) => {
      const isNewTheme = topic.theme !== lastTheme;
      lastTheme = topic.theme;

      tableBody.push([
        {
          alignment: 'center',
          text: isFirstRow ? `${lesson.lessonNumber}` : '',
          border: [true, isFirstRow, true, index === array.length - 1],
        },
        {
          alignment: 'center',
          text: isFirstRow ? formattedDate : '',
          border: [true, isFirstRow, true, index === array.length - 1],
        },
        {
          alignment: 'center',
          text: '',
          border: [true, isFirstRow, true, index === array.length - 1],
        },
        {
          alignment: 'center',
          text: isFirstRow ? fullNameTeacher : '',
          border: [true, isFirstRow, true, index === array.length - 1],
        },
        {
          text: isNewTheme ? topic.theme : '',
          border: [true, isFirstRow, true, index === array.length - 1],
        },
        {
          text: `${topic.number} ${topic.name}`,
          border: [true, isFirstRow, true, index === array.length - 1],
        },
        {
          alignment: 'center',
          text: `${topic.hours}`,
          border: [true, isFirstRow, true, index === array.length - 1],
        },
        {
          alignment: 'center',
          text: isFirstRow ? `${lesson.totalHours}` : '',
          border: [true, isFirstRow, true, index === array.length - 1],
        },
      ]);
      isFirstRow = false;
    });
  });

  tableBody.push([
    { text: 'Итого:', colSpan: 6, alignment: 'right', bold: true },
    {},
    {},
    {},
    {},
    {},
    { text: `${totalHoursSum}`, alignment: 'center', bold: true },
    {},
  ]);

  return {
    pageOrientation: 'landscape',
    content: [
      { text: 'Утверждено:', style: 'pageHeader', alignment: 'right' },
      {
        text: `Генеральный директор: _____________________ / ${fullNameDirector} /`,
        style: 'pageHeader',
        alignment: 'right',
      },
      { text: 'РАСПИСАНИЕ', style: 'header', alignment: 'center' },
      {
        text: 'подготовки водителей транспортных средств категории «В»',
        style: 'subHeader',
        alignment: 'center',
      },
      {
        text: `Учебной группы № ${activeGroupNumber} ; Дни занятий: __________________________________`,
        style: 'subHeader',
        alignment: 'center',
      },
      {
        text: `День начала занятий ${activeStartTrainingDate} окончание ${activeEndTrainingDate}`,
        style: 'subHeader',
        alignment: 'center',
      },
      {
        style: 'tableExample',
        margin: [0, 5, 0, 0],
        fontSize: 10,
        table: {
          widths: ['4%', '5%', '6%', '9%', '27%', '39.5%', '5%', '4.5%'],
          body: tableBody,
          layout: {
            hLineColor: (i, node) =>
              i === 0 || i === node.table.body.length - 1 ? 'black' : 'white',
            vLineColor: () => 'black',
          },
        },
      },
    ],
    styles: {
      pageHeader: { fontSize: 10, bold: true },
      header: { fontSize: 12, bold: true },
      subHeader: { fontSize: 10 },
      tableHeader: { fontSize: 8, alignment: 'center' },
    },
  };
}
