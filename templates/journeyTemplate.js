import SCHEDULE from '@/data/scheduleLectureFourHours.json';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const themeTable = [
  'Организация и выполнение грузовых перевозок автотранспортом',
  'Организация и выполнение пассажирских перевозок автотранспортом',
  'Основы законодательства в сфере дорожного движения',
  'Основы управления транспортными средствами',
  'Первая помощь при дорожно-транспортном происшествии',
  'Психофизиологические основы деятельности водителя',
  'Устройство и техническое обслуживание транспортных средств категории «В» как объектов управления',
];

function generateTrainingSchedule(startTrainingDate, lessons, theme) {
  let currentDate = new Date(startTrainingDate);
  let themesMap = {};

  lessons.forEach((lesson) => {
    while (![0, 3, 6].includes(currentDate.getDay())) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    let formattedDate = format(currentDate, 'dd/MM', { locale: ru });

    lesson.topics.forEach((topic) => {
      if (topic.theme === theme) {
        if (!themesMap[topic.theme]) {
          themesMap[topic.theme] = [];
        }
        themesMap[topic.theme].push({ ...topic, date: formattedDate });
      }
    });

    currentDate.setDate(currentDate.getDate() + 1);
  });

  const groupedByDate = themesMap[theme]?.reduce((acc, item) => {
    const dateKey = item.date;
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: item.date,
        numbers: [],
        names: [],
        hours: 0,
      };
    }
    acc[dateKey].numbers.push(item.number);
    acc[dateKey].names.push(item.name);
    acc[dateKey].hours += item.hours;

    return acc;
  }, {});

  return Object.values(groupedByDate || {});
}

export default function journeyTemplate(group = {}, company = {}) {
  const { companyName } = company;
  const {
    groupNumber,
    startTrainingDate,
    endTrainingDate,
    students,
    theoryTeachers: [{ lastName, firstName, middleName }],
  } = group;

  const activeGroupNumber = groupNumber ? `${groupNumber}` : `_____`;
  const activeStartTrainingDate = startTrainingDate
    ? `${format(new Date(startTrainingDate), 'PPPP', { locale: ru })}`
    : '____/____/________';
  const activeEndTrainingDate = endTrainingDate
    ? `${format(new Date(endTrainingDate), 'PPPP', { locale: ru })}`
    : '____/____/________';
  const sortedStudents = students.sort((a, b) => a.studentNumber - b.studentNumber);
  const fullNameTeacher =
    lastName !== '-' && firstName !== '-'
      ? `${lastName} ${firstName[0]}. ${middleName !== '-' ? middleName[0] + '.' : ''}`
      : '';

  const sortedTopicsByTheme1 = generateTrainingSchedule(startTrainingDate, SCHEDULE, themeTable[2]);
  const sortedTopicsByTheme2 = generateTrainingSchedule(startTrainingDate, SCHEDULE, themeTable[5]);
  const sortedTopicsByTheme3 = generateTrainingSchedule(startTrainingDate, SCHEDULE, themeTable[3]);
  const sortedTopicsByTheme4 = generateTrainingSchedule(startTrainingDate, SCHEDULE, themeTable[4]);
  const sortedTopicsByTheme5 = generateTrainingSchedule(startTrainingDate, SCHEDULE, themeTable[6]);
  const sortedTopicsByTheme6 = generateTrainingSchedule(startTrainingDate, SCHEDULE, themeTable[0]);
  const sortedTopicsByTheme7 = generateTrainingSchedule(startTrainingDate, SCHEDULE, themeTable[1]);

  return {
    pageOrientation: 'landscape',
    styles: {
      pageHeader: { fontSize: 12, bold: true },
      header: { fontSize: 22, bold: true, alignment: 'center' },
      subHeader: { fontSize: 16, alignment: 'center' },
      item: { fontSize: 12, margin: [0, 2, 0, 2] },
      tableHeader: { fontSize: 9, alignment: 'center' },
      tableHeaderDown: { fontSize: 10, alignment: 'center', lineHeight: 1.2 },
      table: { fontSize: 7.5 },
      tabExamText: {
        bold: true,
        alignment: 'center',
        fontSize: 12,
        lineHeight: 1.2,
      },
    },
    content: [
      { text: companyName, style: 'pageHeader', alignment: 'right' },
      { text: 'ЖУРНАЛ', style: 'header', margin: [0, 100, 0, 25] },
      {
        text: 'учета занятий по образовательной программе профессиональной подготовки водителей транспортных средств категории "В"',
        style: 'subHeader',
        margin: [200, 0, 200, 25],
      },
      {
        text: `Учебная группа № ${activeGroupNumber}`,
        style: 'subHeader',
        margin: [0, 0, 0, 50],
      },
      {
        text: `Обучение начато: ${activeStartTrainingDate}`,
        style: 'subHeader',
        alignment: 'right',
      },
      {
        text: `Обучение окончено: ${activeEndTrainingDate}`,
        style: 'subHeader',
        alignment: 'right',
        pageBreak: 'after',
      },
      { text: 'Содержание', style: 'header', margin: [50, 10, 0, 25], alignment: 'left' },
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: 'Сведения о составе учебной группы', style: 'item' },
              { text: '3', alignment: 'right' },
            ],
            [
              {
                text: 'Учебные предметы базового курса',
                style: 'subHeader',
                colSpan: 2,
                alignment: 'left',
                margin: [50, 0, 0, 0],
              },
              {},
            ],
            [
              {
                text: 'Учебный предмет "Основы законодательства в сфере дорожного движения"',
                style: 'item',
              },
              { text: '4', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Психофизиологические основы деятельности водителя"',
                style: 'item',
              },
              { text: '5', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Основы управления транспортными средствами"',
                style: 'item',
              },
              { text: '6', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Первая помощь при дорожно-транспортном происшествии"',
                style: 'item',
              },
              { text: '7', alignment: 'right' },
            ],
            [
              {
                text: 'Учебные предметы специального цикла',
                style: 'subHeader',
                colSpan: 2,
                alignment: 'left',
                margin: [50, 0, 0, 0],
              },
              {},
            ],
            [
              {
                text: 'Учебный предмет "Устройство и техническое обслуживание транспортных средств категории "В" как объектов управления"',
                style: 'item',
              },
              { text: '8', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Основы управления транспортными средствами категории B"',
                style: 'item',
              },
              { text: '-', alignment: 'right' },
            ],
            [
              {
                text: 'Учебные предметы профессионального цикла',
                style: 'subHeader',
                colSpan: 2,
                alignment: 'left',
                margin: [50, 0, 0, 0],
              },
              {},
            ],
            [
              {
                text: 'Учебный предмет "Организация и выполнение грузовых перевозок автомобильным транспортом"',
                style: 'item',
              },
              { text: '9', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Организация и выполнение пассажирских перевозок автомобильным транспортом"',
                style: 'item',
              },
              { text: '10', alignment: 'right' },
            ],
            [
              { text: '', style: 'item' },
              { text: '', alignment: 'right' },
            ],
            [
              {
                text: 'Учет вождения',
                style: 'subHeader',
                colSpan: 2,
                alignment: 'left',
                margin: [50, 0, 0, 0],
              },
              {},
            ],
            [
              { text: 'Результаты квалификационного экзамена', style: 'item', bold: true },
              { text: '11', alignment: 'right' },
            ],
            [
              { text: 'Выполнение учебного плана', style: 'item', bold: true },
              { text: '12', alignment: 'right' },
            ],
            [
              { text: 'Сведения о результатах обучения', style: 'item', bold: true },
              { text: '13', alignment: 'right' },
            ],
            [
              { text: 'Записи проверяющих', style: 'item', bold: true },
              { text: '14', alignment: 'right', pageBreak: 'after' },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0,
          vLineWidth: () => 0,
        },
      },
      {
        text: 'Сведения о составе группы',
        style: 'subHeader',
        margin: [0, 0, 0, 5],
      },
      {
        text: 'Приказ № _____ от ____________________________',
        fontSize: 12,
        alignment: 'right',
      },
      {
        style: 'tableStudents',
        margin: [0, 5, 0, 0],
        fontSize: 9,
        table: {
          widths: ['3.5%', '20%', '8%', '9.5%', '10%', '30%', '11%', '8%'],
          body: [
            [
              { text: '№ п/п', style: 'tableHeader' },
              { text: 'Фамилия, имя и отчество обучающегося', style: 'tableHeader' },
              { text: 'Дата рождения', style: 'tableHeader' },
              { text: 'Образование', style: 'tableHeader' },
              { text: 'Место работы', style: 'tableHeader' },
              { text: 'Адрес регистрации по паспорту, контактные телефоны', style: 'tableHeader' },
              {
                colSpan: 2,
                text: 'Мед. Справка (№, дата выдачи)',
                style: 'tableHeader',
              },
              {},
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              {
                text: `${student.lastName} ${student.firstName} ${student.middleName ? ' ' + student.middleName : ''}`,
              },
              {
                text: student.birthDate
                  ? format(new Date(student.birthDate), 'dd/MM/yyyy', { locale: ru })
                  : '',
                alignment: 'center',
              },
              { text: student.education },
              { text: student.placeOfWork },
              { text: `${student.phone} ${student.registrationAddress}` },
              { text: `${student.medicalNumber} ${student.medicalIssuer}` },
              {
                text: student.medicalIssueDate
                  ? format(new Date(student.medicalIssueDate), 'dd/MM/yyyy', { locale: ru })
                  : '',
                alignment: 'center',
              },
            ]),
          ],
        },
      },
      { text: '', pageBreak: 'after' },
      {
        columns: [
          {
            text: `Учебный предмет: ${themeTable[2]}`,
            fontSize: 10,
            alignment: 'left',
            margin: [0, 0, 0, 2],
          },
          {
            text: `Фамилия преподавателя: ${fullNameTeacher}`,
            fontSize: 10,
            alignment: 'right',
            margin: [0, 0, 0, 2],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            table: {
              widths: [
                '15%',
                ...new Array(sortedTopicsByTheme1.length).fill(
                  `${(100 - 26) / sortedTopicsByTheme1.length}%'`,
                ),
                '11%',
              ],
              body: [
                [
                  { text: 'Фамилия ученика', style: 'tableHeader' },
                  ...sortedTopicsByTheme1.map((group) => ({
                    text: group.date,
                    style: 'tableHeader',
                  })),
                  { text: 'Оценка', style: 'tableHeader' },
                ],
                ...sortedStudents.map((student) => {
                  return [
                    { text: student ? student.lastName : '', style: 'table' },
                    ...new Array(sortedTopicsByTheme1.length).fill({
                      text: '',
                      style: 'table',
                    }),
                    { text: '', style: 'table' },
                  ];
                }),
              ],
            },
          },
          {
            width: '50%',
            table: {
              widths: ['10%', '8%', '60%', '9%', '12%'],
              body: [
                [
                  { text: 'Дата', style: 'tableHeader' },
                  { text: '№ тем', style: 'tableHeader' },
                  { text: 'Содержание уроков', style: 'tableHeader' },
                  { text: 'Часы', style: 'tableHeader' },
                  { text: 'Подпись препод', style: 'tableHeader' },
                ],
                ...sortedTopicsByTheme1.map((group) => [
                  { text: group.date, style: 'table' },
                  { text: group.numbers.join(', '), style: 'table' },
                  { text: group.names.join(', '), style: 'table' },
                  { text: group.hours.toString(), style: 'table' },
                  { text: '', style: 'table' },
                ]),
              ],
            },
          },
        ],
      },
      { text: '', pageBreak: 'after' },
      {
        columns: [
          {
            text: `Учебный предмет: ${themeTable[5]}`,
            fontSize: 10,
            alignment: 'left',
            margin: [0, 0, 0, 2],
          },
          {
            text: `Фамилия преподавателя: ${fullNameTeacher}`,
            fontSize: 10,
            alignment: 'right',
            margin: [0, 0, 0, 2],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            table: {
              widths: [
                '15%',
                ...new Array(sortedTopicsByTheme2.length).fill(
                  `${(100 - 26) / sortedTopicsByTheme2.length}%'`,
                ),
                '11%',
              ],
              body: [
                [
                  { text: 'Фамилия ученика', style: 'tableHeader' },
                  ...sortedTopicsByTheme2.map((group) => ({
                    text: group.date,
                    style: 'tableHeader',
                  })),
                  { text: 'Оценка', style: 'tableHeader' },
                ],
                ...sortedStudents.map((student) => {
                  return [
                    { text: student ? student.lastName : '', style: 'table' },
                    ...new Array(sortedTopicsByTheme2.length).fill({
                      text: '',
                      style: 'table',
                    }),
                    { text: '', style: 'table' },
                  ];
                }),
              ],
            },
          },
          {
            width: '50%',
            table: {
              widths: ['10%', '8%', '60%', '9%', '12%'],
              body: [
                [
                  { text: 'Дата', style: 'tableHeader' },
                  { text: '№ тем', style: 'tableHeader' },
                  { text: 'Содержание уроков', style: 'tableHeader' },
                  { text: 'Часы', style: 'tableHeader' },
                  { text: 'Подпись препод', style: 'tableHeader' },
                ],
                ...sortedTopicsByTheme2.map((group) => [
                  { text: group.date, style: 'table' },
                  { text: group.numbers.join(', '), style: 'table' },
                  { text: group.names.join(', '), style: 'table' },
                  { text: group.hours.toString(), style: 'table' },
                  { text: '', style: 'table' },
                ]),
              ],
            },
          },
        ],
      },
      { text: '', pageBreak: 'after' },
      {
        columns: [
          {
            text: `Учебный предмет: ${themeTable[3]}`,
            fontSize: 10,
            alignment: 'left',
            margin: [0, 0, 0, 2],
          },
          {
            text: `Фамилия преподавателя: ${fullNameTeacher}`,
            fontSize: 10,
            alignment: 'right',
            margin: [0, 0, 0, 2],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            table: {
              widths: [
                '15%',
                ...new Array(sortedTopicsByTheme3.length).fill(
                  `${(100 - 26) / sortedTopicsByTheme3.length}%'`,
                ),
                '11%',
              ],
              body: [
                [
                  { text: 'Фамилия ученика', style: 'tableHeader' },
                  ...sortedTopicsByTheme3.map((group) => ({
                    text: group.date,
                    style: 'tableHeader',
                  })),
                  { text: 'Оценка', style: 'tableHeader' },
                ],
                ...sortedStudents.map((student) => {
                  return [
                    { text: student ? student.lastName : '', style: 'table' },
                    ...new Array(sortedTopicsByTheme3.length).fill({
                      text: '',
                      style: 'table',
                    }),
                    { text: '', style: 'table' },
                  ];
                }),
              ],
            },
          },
          {
            width: '50%',
            table: {
              widths: ['10%', '8%', '60%', '9%', '12%'],
              body: [
                [
                  { text: 'Дата', style: 'tableHeader' },
                  { text: '№ тем', style: 'tableHeader' },
                  { text: 'Содержание уроков', style: 'tableHeader' },
                  { text: 'Часы', style: 'tableHeader' },
                  { text: 'Подпись препод', style: 'tableHeader' },
                ],
                ...sortedTopicsByTheme3.map((group) => [
                  { text: group.date, style: 'table' },
                  { text: group.numbers.join(', '), style: 'table' },
                  { text: group.names.join(', '), style: 'table' },
                  { text: group.hours.toString(), style: 'table' },
                  { text: '', style: 'table' },
                ]),
              ],
            },
          },
        ],
      },
      { text: '', pageBreak: 'after' },
      {
        columns: [
          {
            text: `Учебный предмет: ${themeTable[4]}`,
            fontSize: 10,
            alignment: 'left',
            margin: [0, 0, 0, 2],
          },
          {
            text: `Фамилия преподавателя: ${fullNameTeacher}`,
            fontSize: 10,
            alignment: 'right',
            margin: [0, 0, 0, 2],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            table: {
              widths: [
                '15%',
                ...new Array(sortedTopicsByTheme4.length).fill(
                  `${(100 - 26) / sortedTopicsByTheme4.length}%'`,
                ),
                '11%',
              ],
              body: [
                [
                  { text: 'Фамилия ученика', style: 'tableHeader' },
                  ...sortedTopicsByTheme4.map((group) => ({
                    text: group.date,
                    style: 'tableHeader',
                  })),
                  { text: 'Оценка', style: 'tableHeader' },
                ],
                ...sortedStudents.map((student) => {
                  return [
                    { text: student ? student.lastName : '', style: 'table' },
                    ...new Array(sortedTopicsByTheme4.length).fill({
                      text: '',
                      style: 'table',
                    }),
                    { text: '', style: 'table' },
                  ];
                }),
              ],
            },
          },
          {
            width: '50%',
            table: {
              widths: ['10%', '8%', '60%', '9%', '12%'],
              body: [
                [
                  { text: 'Дата', style: 'tableHeader' },
                  { text: '№ тем', style: 'tableHeader' },
                  { text: 'Содержание уроков', style: 'tableHeader' },
                  { text: 'Часы', style: 'tableHeader' },
                  { text: 'Подпись препод', style: 'tableHeader' },
                ],
                ...sortedTopicsByTheme4.map((group) => [
                  { text: group.date, style: 'table' },
                  { text: group.numbers.join(', '), style: 'table' },
                  { text: group.names.join(', '), style: 'table' },
                  { text: group.hours.toString(), style: 'table' },
                  { text: '', style: 'table' },
                ]),
              ],
            },
          },
        ],
      },
      { text: '', pageBreak: 'after' },
      {
        columns: [
          {
            text: `Учебный предмет: ${themeTable[6]}`,
            fontSize: 10,
            alignment: 'left',
            margin: [0, 0, 0, 2],
          },
          {
            text: `Фамилия преподавателя: ${fullNameTeacher}`,
            fontSize: 10,
            alignment: 'right',
            margin: [0, 0, 0, 2],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            table: {
              widths: [
                '15%',
                ...new Array(sortedTopicsByTheme5.length).fill(
                  `${(100 - 26) / sortedTopicsByTheme5.length}%'`,
                ),
                '11%',
              ],
              body: [
                [
                  { text: 'Фамилия ученика', style: 'tableHeader' },
                  ...sortedTopicsByTheme5.map((group) => ({
                    text: group.date,
                    style: 'tableHeader',
                  })),
                  { text: 'Оценка', style: 'tableHeader' },
                ],
                ...sortedStudents.map((student) => {
                  return [
                    { text: student ? student.lastName : '', style: 'table' },
                    ...new Array(sortedTopicsByTheme5.length).fill({
                      text: '',
                      style: 'table',
                    }),
                    { text: '', style: 'table' },
                  ];
                }),
              ],
            },
          },
          {
            width: '50%',
            table: {
              widths: ['10%', '8%', '60%', '9%', '12%'],
              body: [
                [
                  { text: 'Дата', style: 'tableHeader' },
                  { text: '№ тем', style: 'tableHeader' },
                  { text: 'Содержание уроков', style: 'tableHeader' },
                  { text: 'Часы', style: 'tableHeader' },
                  { text: 'Подпись препод', style: 'tableHeader' },
                ],
                ...sortedTopicsByTheme5.map((group) => [
                  { text: group.date, style: 'table' },
                  { text: group.numbers.join(', '), style: 'table' },
                  { text: group.names.join(', '), style: 'table' },
                  { text: group.hours.toString(), style: 'table' },
                  { text: '', style: 'table' },
                ]),
              ],
            },
          },
        ],
      },
      { text: '', pageBreak: 'after' },
      {
        columns: [
          {
            text: `Учебный предмет: ${themeTable[0]}`,
            fontSize: 10,
            alignment: 'left',
            margin: [0, 0, 0, 2],
          },
          {
            text: `Фамилия преподавателя: ${fullNameTeacher}`,
            fontSize: 10,
            alignment: 'right',
            margin: [0, 0, 0, 2],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            table: {
              widths: [
                '15%',
                ...new Array(sortedTopicsByTheme6.length).fill(
                  `${(100 - 26) / sortedTopicsByTheme6.length}%'`,
                ),
                '11%',
              ],
              body: [
                [
                  { text: 'Фамилия ученика', style: 'tableHeader' },
                  ...sortedTopicsByTheme6.map((group) => ({
                    text: group.date,
                    style: 'tableHeader',
                  })),
                  { text: 'Оценка', style: 'tableHeader' },
                ],
                ...sortedStudents.map((student) => {
                  return [
                    { text: student ? student.lastName : '', style: 'table' },
                    ...new Array(sortedTopicsByTheme6.length).fill({
                      text: '',
                      style: 'table',
                    }),
                    { text: '', style: 'table' },
                  ];
                }),
              ],
            },
          },
          {
            width: '50%',
            table: {
              widths: ['10%', '8%', '60%', '9%', '12%'],
              body: [
                [
                  { text: 'Дата', style: 'tableHeader' },
                  { text: '№ тем', style: 'tableHeader' },
                  { text: 'Содержание уроков', style: 'tableHeader' },
                  { text: 'Часы', style: 'tableHeader' },
                  { text: 'Подпись препод', style: 'tableHeader' },
                ],
                ...sortedTopicsByTheme6.map((group) => [
                  { text: group.date, style: 'table' },
                  { text: group.numbers.join(', '), style: 'table' },
                  { text: group.names.join(', '), style: 'table' },
                  { text: group.hours.toString(), style: 'table' },
                  { text: '', style: 'table' },
                ]),
              ],
            },
          },
        ],
      },
      { text: '', pageBreak: 'after' },
      {
        columns: [
          {
            text: `Учебный предмет: ${themeTable[1]}`,
            fontSize: 10,
            alignment: 'left',
            margin: [0, 0, 0, 2],
          },
          {
            text: `Фамилия преподавателя: ${fullNameTeacher}`,
            fontSize: 10,
            alignment: 'right',
            margin: [0, 0, 0, 2],
          },
        ],
      },
      {
        columns: [
          {
            width: '50%',
            table: {
              widths: [
                '15%',
                ...new Array(sortedTopicsByTheme7.length).fill(
                  `${(100 - 26) / sortedTopicsByTheme7.length}%'`,
                ),
                '11%',
              ],
              body: [
                [
                  { text: 'Фамилия ученика', style: 'tableHeader' },
                  ...sortedTopicsByTheme7.map((group) => ({
                    text: group.date,
                    style: 'tableHeader',
                  })),
                  { text: 'Оценка', style: 'tableHeader' },
                ],
                ...sortedStudents.map((student) => {
                  return [
                    { text: student ? student.lastName : '', style: 'table' },
                    ...new Array(sortedTopicsByTheme7.length).fill({
                      text: '',
                      style: 'table',
                    }),
                    { text: '', style: 'table' },
                  ];
                }),
              ],
            },
          },
          {
            width: '50%',
            table: {
              widths: ['10%', '8%', '60%', '9%', '12%'],
              body: [
                [
                  { text: 'Дата', style: 'tableHeader' },
                  { text: '№ тем', style: 'tableHeader' },
                  { text: 'Содержание уроков', style: 'tableHeader' },
                  { text: 'Часы', style: 'tableHeader' },
                  { text: 'Подпись препод', style: 'tableHeader' },
                ],
                ...sortedTopicsByTheme7.map((group) => [
                  { text: group.date, style: 'table' },
                  { text: group.numbers.join(', '), style: 'table' },
                  { text: group.names.join(', '), style: 'table' },
                  { text: group.hours.toString(), style: 'table' },
                  { text: '', style: 'table' },
                ]),
              ],
            },
          },
        ],
      },
      { text: '', pageBreak: 'after' },
      {
        text: 'Результаты квалифицированного экзамена',
        style: 'subHeader',
        margin: [0, 0, 0, 5],
      },
      {
        style: 'tableStudents',
        margin: [0, 5, 0, 0],
        fontSize: 9,
        table: {
          widths: ['5%', '*', '*', '*', '*', '*', '*', '*', '*'],
          body: [
            [
              {
                colSpan: 9,
                text: 'Наименование учебных предметов',
                style: 'tableHeader',
                fontSize: 12,
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: '№ п/п',
                style: 'tableHeader',
              },
              {
                text: 'Основы законодательства в сфере дорожного движения',
                style: 'tableHeader',
              },
              {
                text: 'Устройство и техническое обслуживание ТС категории "В" как объектов управления',
                style: 'tableHeader',
              },
              {
                text: 'Основы управления транспортными средствами',
                style: 'tableHeader',
              },
              {
                text: 'Организация и выполнения грузовых перевозок автомобильным транспортом',
                style: 'tableHeader',
              },
              {
                text: 'Организация и выполнение пассажирских перевозок автомобиль ным транспортом',
                style: 'tableHeader',
              },
              {
                text: 'Практическая квалификационная работа первый этап',
                style: 'tableHeader',
              },
              {
                text: 'Практическая квалификационная работа второй этап',
                style: 'tableHeader',
              },
              {
                text: 'Итоговая оценка',
                style: 'tableHeader',
                bold: true,
                fontSize: 14,
              },
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              {
                text: 'Сдано',
                style: 'tabExamText',
              },
              {
                text: 'Сдано',
                style: 'tabExamText',
              },
              {
                text: 'Сдано',
                style: 'tabExamText',
              },
              {
                text: 'Сдано',
                style: 'tabExamText',
              },
              {
                text: 'Сдано',
                style: 'tabExamText',
              },
              {
                text: 'Сдано',
                style: 'tabExamText',
              },
              {
                text: 'Сдано',
                style: 'tabExamText',
              },
              {
                text: 'Зачет',
                style: 'tabExamText',
              },
            ]),
          ],
        },
      },
      { text: '', pageBreak: 'after' },
      {
        text: 'Выполнение учебного плана',
        style: 'subHeader',
        margin: [0, 0, 0, 5],
      },
      {
        style: 'tableStudents',
        margin: [0, 5, 0, 0],
        fontSize: 10,
        lineHeight: 1.2,
        table: {
          widths: [
            '3.5%',
            '*',
            '8%',
            '5%',
            '5%',
            '5%',
            '5%',
            '5%',
            '5%',
            '5%',
            '5%',
            '5%',
            '5%',
            '5%',
            '5%',
          ],
          body: [
            [
              { rowSpan: 3, text: '№ п/п', style: 'tableHeaderDown' },
              { rowSpan: 3, text: 'Учебные предметы', style: 'tableHeaderDown' },
              { rowSpan: 3, text: 'Кол-во часов по плану', style: 'tableHeaderDown' },
              {
                colSpan: 12,
                text: 'распределение учебных часов по месяцам обучения',
                style: 'tableHeaderDown',
              },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {},
              {},
              {},
              {
                colSpan: 2,
                text: '',
              },
              {},
              {
                colSpan: 2,
                text: '',
              },
              {},
              {
                colSpan: 2,
                text: '',
              },
              {},
              {
                colSpan: 2,
                text: '',
              },
              {},
              {
                colSpan: 2,
                text: '',
              },
              {},
              {
                colSpan: 2,
                text: 'ИТОГО',
                style: 'tableHeaderDown',
              },
              {},
            ],
            [
              {},
              {},
              {},
              { text: 'план', style: 'tableHeaderDown' },
              { text: 'факт', style: 'tableHeaderDown' },
              { text: 'план', style: 'tableHeaderDown' },
              { text: 'факт', style: 'tableHeaderDown' },
              { text: 'план', style: 'tableHeaderDown' },
              { text: 'факт', style: 'tableHeaderDown' },
              { text: 'план', style: 'tableHeaderDown' },
              { text: 'факт', style: 'tableHeaderDown' },
              { text: 'план', style: 'tableHeaderDown' },
              { text: 'факт', style: 'tableHeaderDown' },
              { text: 'план', style: 'tableHeaderDown' },
              { text: 'факт', style: 'tableHeaderDown' },
            ],
            [
              { text: '1', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: 'Основы законодательства в сфере дорожного движения' },
              { text: '43', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '43', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: '43', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
            ],
            [
              { text: '2', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: 'Психофизиологические основы деятельности водителя' },
              { text: '12', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '12', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: '12', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
            ],
            [
              { text: '3', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: 'Основы управления транспортными средствами' },
              { text: '27', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '27', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: '27', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
            ],
            [
              { text: '4', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: 'Первая помощь при дорожно-транспортном происшествии' },
              { text: '16', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '16', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: '16', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
            ],
            [
              { text: '5', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {
                text: 'Устройство и техническое обслуживание ТС категории "В" как объектов управления',
              },
              { text: '20', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '20', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: '20', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
            ],
            [
              { text: '6', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {
                text: 'Организация и выполнение грузовых перевозок автомобильным транспортом',
              },
              { text: '9', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '9', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: '9', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
            ],
            [
              { text: '7', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {
                text: 'Организация и выполнение пассажирских перевозок автомобильным транспортом',
              },
              { text: '7', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '7', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
              { text: '7', alignment: 'center', fontSize: '12', margin: [0, 7, 0, 0] },
            ],
            [
              {},
              {
                text: 'Квалификационный экзамен',
                bold: true,
                margin: [0, 5, 0, 0],
              },
              { text: '4', alignment: 'center', fontSize: '12', margin: [0, 5, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '4', alignment: 'center', fontSize: '12', margin: [0, 5, 0, 0] },
              { text: '4', alignment: 'center', fontSize: '12', margin: [0, 5, 0, 0] },
            ],
            [
              {},
              {
                text: 'ИТОГО',
                bold: true,
                margin: [0, 5, 0, 0],
                alignment: 'center',
              },
              { text: '134', alignment: 'center', fontSize: '12', margin: [0, 5, 0, 0] },
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              {},
              { text: '134', alignment: 'center', fontSize: '12', margin: [0, 5, 0, 0] },
              { text: '134', alignment: 'center', fontSize: '12', margin: [0, 5, 0, 0] },
            ],
          ],
        },
      },
      { text: '', pageBreak: 'after' },
      {
        text: 'Сведения о результатах обучения',
        style: 'subHeader',
        margin: [0, 0, 0, 5],
      },
      {
        text: '1.Результаты сдачи квалификационного экзамена в учебных группах',
        style: 'subHeader',
        margin: [0, 20, 0, 5],
      },
      {
        style: 'tableStudents',
        margin: [0, 5, 0, 0],
        fontSize: 9,
        table: {
          widths: ['9%', '9%', '9%', '9%', '9%', '9%', '9%', '9%', '9%', '9%', '10%'],
          body: [
            [
              {
                rowSpan: 2,
                text: 'Количество обучающихся к началу обучения',
                style: 'tableHeader',
              },
              { colSpan: 2, text: 'Выбыли в процессе обучения', style: 'tableHeader' },
              {},
              {
                rowSpan: 2,
                text: 'Допущено к квалификационному экзаменуя',
                style: 'tableHeader',
              },
              { colSpan: 4, text: 'Сдали квалификационный экзамен', style: 'tableHeader' },
              {},
              {},
              {},
              {
                rowSpan: 2,
                text: 'не сдали квалификационный экзамен',
                style: 'tableHeader',
              },
              {
                rowSpan: 2,
                text: 'не явились на квалификационный экзамен',
                style: 'tableHeader',
              },
              {
                rowSpan: 2,
                text: '№ экзаменационного протокола',
                style: 'tableHeader',
              },
            ],
            [
              {},
              { text: 'всего', style: 'tableHeader' },
              { text: 'в том числе по неуспеваемости', style: 'tableHeader' },
              {},
              { text: 'отлично', style: 'tableHeader' },
              { text: 'хорошо', style: 'tableHeader' },
              { text: 'удовлетворительно', style: 'tableHeader' },
              { text: 'всего', style: 'tableHeader' },
              {},
              {},
              {},
            ],
            [{ text: ' ', margin: [0, 16, 0, 0] }, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
          ],
        },
      },
      {
        text: '2. Сведения об обучающихся, не сдавших квалификационный экзамен',
        style: 'subHeader',
        margin: [0, 20, 0, 5],
      },
      {
        style: 'tableStudents',
        margin: [0, 5, 0, 0],
        fontSize: 12,
        table: {
          widths: ['auto', '*', '*'],
          body: [
            [
              { text: 'Ф.И.О. обучавшихся не сдавших квалификационный экзамен' },
              { text: 'По какому учебному предмету не сдали квалификационный экзамен' },
              { text: 'Мероприятия по их дальнейшему обучению' },
            ],
            [{ text: ' ', margin: [0, 16, 0, 0] }, {}, {}],
            [{ text: ' ', margin: [0, 16, 0, 0] }, {}, {}],
            [{ text: ' ', margin: [0, 16, 0, 0] }, {}, {}],
            [{ text: ' ', margin: [0, 16, 0, 0] }, {}, {}],
            [{ text: ' ', margin: [0, 16, 0, 0] }, {}, {}],
            [{ text: ' ', margin: [0, 16, 0, 0] }, {}, {}],
            [{ text: ' ', margin: [0, 16, 0, 0] }, {}, {}],
          ],
        },
      },
      { text: '', pageBreak: 'after' },
      {
        text: 'Записи проверяющих',
        style: 'subHeader',
        margin: [0, 0, 0, 5],
      },
      {
        style: 'tableStudents',
        margin: [0, 5, 0, 0],
        fontSize: 12,
        lineHeight: 1.2,
        table: {
          widths: ['auto', '*', '*', '*'],
          body: [
            [
              { text: 'ДАТА', margin: [5, 2, 5, 2] },
              { text: 'Замечание проверяющих', margin: [5, 2, 5, 2] },
              { text: 'Указания и рекомендации', margin: [5, 2, 5, 2] },
              { text: 'Отметки о выполнении', margin: [5, 2, 5, 2] },
            ],
            [{ text: ' ', margin: [0, 30, 0, 0] }, {}, {}, {}],
            [{ text: ' ', margin: [0, 30, 0, 0] }, {}, {}, {}],
            [{ text: ' ', margin: [0, 30, 0, 0] }, {}, {}, {}],
            [{ text: ' ', margin: [0, 30, 0, 0] }, {}, {}, {}],
            [{ text: ' ', margin: [0, 30, 0, 0] }, {}, {}, {}],
            [{ text: ' ', margin: [0, 30, 0, 0] }, {}, {}, {}],
            [{ text: ' ', margin: [0, 30, 0, 0] }, {}, {}, {}],
            [{ text: ' ', margin: [0, 30, 0, 0] }, {}, {}, {}],
          ],
        },
      },
    ],
  };
}
