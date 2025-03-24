const trainingDays = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
];

const generateTimeRow = () => {
  const timeSlots = [];
  for (let hour = 8; hour <= 17; hour++) {
    timeSlots.push({
      text: `${hour}:00`,
      alignment: 'center',
      fillColor: hour === 12 ? '#d3d3d3' : null,
    });
  }

  return {
    table: {
      widths: Array(timeSlots.length).fill('*'),
      body: [timeSlots],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      hLineColor: () => 'white',
    },
  };
};

export default function drivingRecord(group) {
  if (!group) {
    console.error('Ошибка: загрузки данных группы');
    return null;
  }

  const { students } = group;
  return {
    content: students
      .sort((a, b) => a.studentNumber - b.studentNumber)
      .flatMap((student, index) => [
        {
          columns: [
            {
              width: '70%',
              text: `${index + 1}: ${student.lastName} ${student.firstName} ${student.middleName || ''}`,
              italics: true,
              alignment: 'left',
              fontSize: 16,
              bold: true,
            },
            {
              width: '30%',
              text: `Телефон: ${student.phone}`,
              alignment: 'right',
              bold: true,
            },
          ],
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            widths: ['20%', '80%'],
            body: [
              [
                { text: 'День недели', bold: true },
                { text: 'Желаемое время', bold: true },
              ],
              ...trainingDays.map((day) => [
                { text: day, bold: true, margin: [0, 2, 0, 2] },
                generateTimeRow(),
              ]),
            ],
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => 'gray',
          },
          margin: [0, 0, 0, 2],
        },
        {
          text: '* обвести удобное время. Если подходит любое время, можно ничего не обводить',
          margin: [0, 0, 0, 18],
        },
      ]),
  };
}
