import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function personalizedBookA(student, group, company, car) {
  if (!student || !group || !company) {
    console.error('Ошибка: данные отсутствуют');
    return null;
  }

  function getPracticeTeacherFullName(teacherId) {
    const teacher = group.practiceTeachers.find((t) => t.id === teacherId);
    if (!teacher) {
      return 'Преподаватель не найден';
    }
    return `${teacher.lastName} ${teacher.firstName} ${teacher.middleName || ''}`.trim();
  }

  return {
    pageOrientation: 'landscape',
    content: [
      {
        columns: [
          {
            width: '48,5%',
            alignment: 'center',
            border: [true, true, false, true],
            stack: [
              { text: 'Практическая квалификационная работа', bold: true },
              { text: 'Первый этап', margin: [0, 15, 0, 0], bold: true },
              {
                table: {
                  widths: ['17%', '10%', '10%', '10%', '10%', '10%', '13%', '20%'],
                  body: [
                    [
                      {
                        rowSpan: 2,
                        text: 'Дата',
                        style: 'headerTab',
                        margin: [0, 18, 0, 12],
                      },
                      {
                        colSpan: 5,
                        text: 'Штрафные баллы за упражнения',
                        style: 'headerTab',
                      },
                      '',
                      '',
                      '',
                      '',
                      {
                        rowSpan: 2,
                        text: 'Итоговая оценка',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        rowSpan: 2,
                        text: 'Подпись экзаменатора',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                    ],
                    [
                      '',
                      {
                        text: '1',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        text: '2',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        text: '3',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        text: '4',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        text: '5',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      '',
                      '',
                    ],
                    ['', '', '', '', '', '', '', ''].map(() => ({
                      text: '',
                      margin: [0, 15, 0, 15],
                    })),
                    ['', '', '', '', '', '', '', ''].map(() => ({
                      text: '',
                      margin: [0, 15, 0, 15],
                    })),
                    ['', '', '', '', '', '', '', ''].map(() => ({
                      text: '',
                      margin: [0, 15, 0, 15],
                    })),
                  ],
                },
                margin: [0, 5, 0, 0],
              },
              { text: 'Второй этап', margin: [0, 15, 0, 0], bold: true },
              {
                table: {
                  widths: ['20%', '20%', '20%', '20%', '20%'],
                  body: [
                    [
                      {
                        text: 'Дата',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        text: 'Номер маршрута',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        text: 'Штрафные баллы',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        text: 'Итоговая оценка',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                      {
                        text: 'Подпись экзаменатора',
                        style: 'headerTab',
                        margin: [0, 10, 0, 10],
                      },
                    ],
                    ['', '', '', '', ''].map(() => ({
                      text: '',
                      margin: [0, 15, 0, 15],
                    })),
                    ['', '', '', '', ''].map(() => ({
                      text: '',
                      margin: [0, 15, 0, 15],
                    })),
                    ['', '', '', '', ''].map(() => ({
                      text: '',
                      margin: [0, 15, 0, 15],
                    })),
                  ],
                },
                margin: [0, 5, 0, 0],
              },
              {
                table: {
                  widths: ['10%', '80%', '10%'],
                  body: [
                    [
                      '',
                      {
                        text: `Обучение вождению транспортного средства категории "В" c ${car?.carTransmission === 'mkp' ? 'механической' : 'автоматической'} трансмиссией проведено в количестве ______ часов`,
                        alignment: 'justify',
                      },
                      '',
                    ],
                  ],
                },
                layout: 'noBorders',
                margin: [0, 5, 0, 0],
              },
              {
                text: `Руководитель _______________________________ /${company.directorSurname} ${company.directorName[0]}. ${company.directorPatronymic ? company.directorPatronymic[0] + '.' : ''}/`,
                margin: [0, 20, 0, 0],
              },
              {
                text: `${format(new Date(), 'PPP', { locale: ru })}`,
                margin: [0, 20, 0, 0],
                alignment: 'right',
              },
            ],
          },
          { text: '', width: '3%' }, // Разделитель
          {
            width: '48,5%',
            alignment: 'center',
            border: [false, true, true, true],
            stack: [
              { text: `${company.companyName}`, bold: true, fontSize: 18 },
              {
                text: 'ИНДИВИДУАЛЬНАЯ КНИЖКА',
                bold: true,
                fontSize: 18,
                margin: [0, 35, 0, 10],
              },
              { text: 'учёта обучения вождению' },
              { text: 'транспортного средства категории "В"' },
              {
                text: `с ${car?.carTransmission === 'mkp' ? 'механической' : 'автоматической'} трансмиссией`,
              },
              {
                text: `${student.lastName} ${student.firstName} ${student.middleName}`,
                bold: true,
                fontSize: 16,
                margin: [0, 25, 0, 15],
              },
              {
                text: [
                  { text: 'Учебная группа №' },
                  { text: ` ${group.groupNumber}`, bold: true, fontSize: 16 },
                ],
                margin: [0, 0, 0, 10],
              },
              {
                text: `Обучение начато  ${format(new Date(group.startTrainingDate), 'dd/MM/yyyy', { locale: ru })} , окончено ${format(new Date(group.endTrainingDate), 'dd/MM/yyyy', { locale: ru })}`,
              },
              {
                text: `Мастер производственного обучения: ${getPracticeTeacherFullName(group.practiceTeachers[0].id)}`,
                margin: [0, 5, 0, 5],
              },
              {
                text: `Учебное ТС: марка RENO LOGAN, гос. рег. знак С 231 ВЕ 53`,
                margin: [0, 0, 0, 20],
              },

              {
                table: {
                  widths: ['2%', '28%', '5%', '65%'],

                  body: [
                    [
                      { rowSpan: 6, text: '', fillColor: 'white' },
                      {
                        rowSpan: 6,
                        stack: [
                          {
                            canvas: [
                              {
                                type: 'rect',
                                x: 0,
                                y: 0,
                                w: 90,
                                h: 120,
                                lineColor: 'black',
                              },
                            ],
                            margin: [25, 15, 0, 0],
                          },
                          {
                            text: 'место для фото',
                            alignment: 'center',
                            fontSize: 9,
                            margin: [0, -70, 0, 0],
                          },
                        ],
                        fillColor: 'white',
                      },
                      { rowSpan: 6, text: '', fillColor: 'white' },
                      {
                        text: 'Правила ведения и хранения',
                        alignment: 'center',
                        fillColor: 'white',
                      },
                    ],
                    [
                      '',
                      '',
                      '',
                      {
                        text: '1. Книжка выдается на руки обучающемуся и хранится у него до окончания обучения.',
                        alignment: 'left',
                        style: 'tableText',
                        fillColor: 'white',
                      },
                    ],
                    [
                      '',
                      '',
                      '',
                      {
                        text: '2. Без предъявления книжки обучающийся к занятию не допускается.',
                        alignment: 'left',
                        style: 'tableText',
                        fillColor: 'white',
                      },
                    ],
                    [
                      '',
                      '',
                      '',
                      {
                        text: '3. По окончании каждого занятия мастер производственного обучения записывает время фактического обучения, выставляет оценку и ставит свою подпись.',
                        alignment: 'left',
                        style: 'tableText',
                        fillColor: 'white',
                      },
                    ],
                    [
                      '',
                      '',
                      '',
                      {
                        text: '4. Обучающийся должен беречь книжку и аккуратно содержать ее.',
                        alignment: 'left',
                        style: 'tableText',
                        fillColor: 'white',
                      },
                    ],
                    [
                      '',
                      '',
                      '',
                      {
                        text: '5. По окончании обучения книжка сдаётся в учебную часть.',
                        alignment: 'left',
                        style: 'tableText',
                        fillColor: 'white',
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
              },
            ],
          },
        ],
        columnGap: 0,
      },
    ],
    styles: {
      headerTab: { fontSize: 9, alignment: 'center' },
      subheader: { fontSize: 16, margin: [0, 5, 0, 5] },
      tableText: { fontSize: 10 },
    },
  };
}
