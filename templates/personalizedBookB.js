import LESSONS from '@/data/lessonPersonalBook.json';

export default function personalizedBookB(group, sessions) {
  if (!LESSONS) {
    console.error('Ошибка: данные о сессиях вождения отсутствуют');
    return null;
  }
  if (!group) {
    console.error('Ошибка: данные о группе отсутствуют');
    return null;
  }
  if (!sessions) {
    console.error('Ошибка: данные о сессиях вождения отсутствуют');
    return null;
  }

  const sortSessions = sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
  let sessionIndex = 0;
  let remainingHour = 0;
  let lastDate = '';

  function getCarTransmission(teacherId) {
    const teacher = group.practiceTeachers.find((t) => t.id === teacherId);
    if (!teacher) return 'Преподаватель не найден';
    const car = teacher.cars && teacher.cars[0];
    if (!car) return 'Автомобиль не найден';
    return car.carTransmission;
  }

  function getNextDateCell(hours) {
    if (sessionIndex >= sortSessions.length) return { text: '', fontSize: 6 };
    const session = sortSessions[sessionIndex];
    const date = new Date(session.date).toLocaleDateString('ru-RU');

    if (hours === 2) {
      const result = { text: date, fontSize: 6 };
      sessionIndex++;
      lastDate = date;
      return result;
    } else if (hours === 1) {
      if (remainingHour === 0) {
        remainingHour = 1;
        lastDate = date;
        const result = { text: date, fontSize: 6 };
        return result;
      } else {
        remainingHour = 0;
        sessionIndex++;
        return { text: lastDate, fontSize: 6 };
      }
    } else {
      return { text: '', fontSize: 6 };
    }
  }

  function buildTableBody(LESSONS) {
    const body = [
      [
        { rowSpan: 2, text: 'Дата', style: 'tableHeader', margin: [0, 25, 0, 0] },
        { colSpan: 2, text: '№ тем', style: 'tableHeader' },
        {},
        {
          rowSpan: 2,
          text: 'Наименование разделов, тем и занятий',
          style: 'tableHeader',
          margin: [0, 25, 0, 0],
        },
        { colSpan: 2, text: 'Количество часов практического обучения', style: 'tableHeader' },
        {},
        { rowSpan: 2, text: 'Оценка', style: 'tableHeader', margin: [0, 25, 0, 0] },
        { colSpan: 2, text: 'Подпись', style: 'tableHeader' },
        {},
      ],
      [
        {},
        {
          text: [{ text: 'М' }, { text: '1', fontSize: 6, margin: [0, 0, 0, 5] }],
          style: 'tableHeader',
          margin: [0, 15, 0, 0],
        },
        {
          text: ['А', { text: '2', fontSize: 6, margin: [0, -5] }],
          style: 'tableHeader',
          margin: [0, 15, 0, 0],
        },
        {},
        { text: 'По учебному плану', style: 'tableHeader' },
        { text: 'Выполнено', style: 'tableHeader' },
        {},
        { text: 'Мастер производственного обучения', style: 'tableHeader' },
        { text: 'Обучающийся', style: 'tableHeader' },
      ],
    ];

    for (const entry of LESSONS) {
      if (entry.topic) {
        body.push([{}, {}, {}, { text: entry.topic, fontSize: 8, bold: true }, {}, {}, {}, {}, {}]);
      }
      if (entry.items) {
        for (const item of entry.items) {
          const repeat = item.repeat || 1;
          for (let i = 0; i < repeat; i++) {
            const dateCell = getNextDateCell(item.hours);
            body.push([
              dateCell,
              { text: item.m, fontSize: 6 },
              { text: item.a, fontSize: 6 },
              { text: item.name, fontSize: 6 },
              { text: String(item.hours), fontSize: 6, alignment: 'center' },
              {},
              {},
              {},
              {},
            ]);
          }
        }
      }
      if (entry.control) {
        body.push([
          {},
          {},
          {},
          {
            text: [
              { text: entry.control, fontSize: 8, bold: true },
              { text: entry.comment, fontSize: 6, margin: [0, -5] },
            ],
          },
          {},
          {},
          {},
          {},
          {},
        ]);
      }
      body.push([{ text: '', margin: [0, 6, 0, 0] }, {}, {}, {}, {}, {}, {}, {}, {}]);
      if (entry.topic || entry.items) {
        body.push([
          {},
          {},
          {},
          { text: 'Итого по разделу', fontSize: 6, bold: true },
          {},
          {},
          {},
          {},
          {},
        ]);
      }
    }

    body.push([{ text: '', margin: [0, 6, 0, 0] }, {}, {}, {}, {}, {}, {}, {}, {}]);
    body.push([{}, {}, {}, { text: 'Итого', fontSize: 6, bold: true }, {}, {}, {}, {}, {}]);
    return body;
  }

  return {
    content: [
      { text: 'Учет обучения вождению транспортного средства категории "В"', style: 'header' },
      {
        text: `c ${getCarTransmission(group.practiceTeachers[0].id) === 'mkp' ? 'механической' : 'автоматической'} трансмиссией`,
        style: 'header',
        margin: [0, 0, 0, 3],
      },
      {
        table: {
          widths: ['8%', '3.5%', '3.5%', '43%', '8%', '8%', '4%', '10%', '10%'],
          body: buildTableBody(LESSONS),
        },
      },
      { text: 'Примечание:', fontSize: 10, margin: [0, 3, 0, 0] },
      { text: '1. Для учебных транспортных средств с механической трансмиссией', fontSize: 10 },
      { text: '2. Для учебных транспортных средств с автоматической трансмиссией', fontSize: 10 },
      {
        text: '3. Выполнение контрольного задания №1 проводится за счет часов темы 1.6 (1.5)',
        fontSize: 10,
      },
      { text: '4. Обучение проводится по желанию обучающегося...', fontSize: 10 },
      {
        text: '5. Выполнение контрольного задания №2 проводится за счет часов темы 2.1',
        fontSize: 10,
      },
    ],
    styles: {
      header: { bold: true, alignment: 'center' },
      tableHeader: { fontSize: 8, alignment: 'center' },
    },
  };
}
