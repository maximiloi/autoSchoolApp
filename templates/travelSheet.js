import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function travelSheet(date, group, company, daySessions) {
  if (!date || !group || !company) {
    console.error('Ошибка: загрузки данных');
    return null;
  }

  const { companyName, actualAddress, phone } = company;
  const { groupNumber, practiceTeachers } = group;
  const carModel = practiceTeachers[0]?.cars[0]?.carModel;
  const carNumber = practiceTeachers[0]?.cars[0]?.carNumber;
  const lastNamePracticeTeachers = practiceTeachers[0]?.lastName;
  const firstNamePracticeTeachers = practiceTeachers[0]?.firstName;
  const middleNamePracticeTeachers = practiceTeachers[0]?.middleName;
  const fullNamePracticeTeachers = `${lastNamePracticeTeachers} ${firstNamePracticeTeachers} ${middleNamePracticeTeachers || ''}`;
  const licenseSeriesPracticeTeachers = practiceTeachers[0]?.licenseSeries;
  const licenseNumberPracticeTeachers = practiceTeachers[0]?.licenseNumber;
  const licensePracticeTeachers = `${licenseSeriesPracticeTeachers} ${licenseNumberPracticeTeachers}`;
  const snilsPracticeTeachers = practiceTeachers[0]?.snils;
  const sortedSessions = [...daySessions].sort((a, b) => {
    const [startA] = a.slot.split('-').map(Number);
    const [startB] = b.slot.split('-').map(Number);
    return startA - startB;
  });

  let totalMinutes = 0;

  return {
    pageOrientation: 'landscape',
    styles: {
      header: { fontSize: 16, bold: true },
      tabHeader: { fontSize: 8 },
    },
    content: [
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Организация: ', bold: true },
              companyName,
              { text: '\n' },
              { text: 'Адрес: ', bold: true },
              actualAddress,
              { text: '\n' },
              { text: 'Телефон: ', bold: true },
              phone,
              { text: '\n' },
            ],
          },
          {
            width: 'auto',
            stack: [
              {
                text: `ПУТЕВОЙ ЛИСТ № ${groupNumber}${format(new Date(date), 'ddMM')}`,
                style: 'header',
                alignment: 'right',
              },
              { text: 'на учебный автомобиль', alignment: 'right' },
              {
                text: `${format(new Date(date), "d MMMM yyyy 'г.'", { locale: ru })}`,
                style: 'header',
                alignment: 'right',
                decoration: 'underline',
              },
            ],
          },
        ],
      },
      '\n',
      {
        columns: [
          {
            width: '50%',
            stack: [
              {
                text: [{ text: 'Марка автомобиля: ', bold: true }, carModel],
                margin: [0, 5, 0, 0],
              },

              { text: [{ text: 'Государственный номерной знак: ', bold: true }, carNumber] },
              {
                text: [
                  { text: 'Преподаватель (водитель): ', bold: true },
                  fullNamePracticeTeachers,
                ],
              },
              {
                text: [
                  { text: 'Водительское удостоверение: ', bold: true },
                  licensePracticeTeachers,
                ],
              },
              {
                text: [
                  { text: 'СНИЛС: ', bold: true },
                  snilsPracticeTeachers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1-$2-$3 $4'),
                ],
              },
              {
                text: [
                  { text: 'Время выезда из гаража: ', bold: true },
                  '__________ ',
                  { text: 'час.мин.', bold: true },
                ],
              },
              {
                text: [
                  { text: 'Время возвращения в гараж: ', bold: true },
                  '__________ ',
                  { text: 'час.мин.', bold: true },
                ],
              },
              {
                text: [
                  { text: 'Показания спидометра при выезде: ', bold: true },
                  '__________ ',
                  { text: 'км.', bold: true },
                ],
              },
              {
                text: [
                  { text: 'Показания спидометра при возвращении в гараж: ', bold: true },
                  '__________ ',
                  { text: 'км.', bold: true },
                ],
              },
            ],
          },
          {
            width: '50%',
            stack: [
              'Автомобиль технически исправен, выезд разрешаю: \n\n_______________________________________',
              { text: 'должность, подпись, расшифровка подписи', fontSize: 8 },
              '\nАвтомобиль в технически исправном состоянии принял водитель: \n\n_______________________________________',
              { text: 'подпись, расшифровка подписи', fontSize: 8 },
              '\nВодитель по состоянию здоровья к управлению допущен: \n\n_______________________________________',
              { text: 'должность, подпись, расшифровка подписи', fontSize: 8 },
            ],
          },
        ],
      },
      '\n\n',
      {
        table: {
          widths: ['3%', '*', '*', '7%', '5%', '*', '5%'],
          body: [
            [
              { text: '№\nп/п', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              {
                text: 'Задание мастеру (водителю)',
                rowSpan: 2,
                alignment: 'center',
                style: 'tabHeader',
              },
              { text: 'Маршрут движения', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Пробег', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Час.', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Отметки о простоях', colSpan: 2, alignment: 'center', style: 'tabHeader' },
              {},
            ],
            [
              {},
              {},
              {},
              {},
              {},
              { text: 'причина простоя', alignment: 'center', style: 'tabHeader' },
              { text: 'время', alignment: 'center', style: 'tabHeader' },
            ],
            ['1', 'Обучение практическому вождению', 'Окуловка по городу и району', '', '', '', ''],
          ],
        },
      },
      '\n\n',
      {
        text: 'ДВИЖЕНИЕ ТОПЛИВА',
        bold: true,
        margin: [0, 10, 0, 5],
      },
      'коэффициент нормы расхода топлива ________ остаток ________ л.',
      'расчётный расход топлива ____________________ л. получено ________ л.',
      {
        text: 'Начальник гаража (зав.курсами) ____________________',
        margin: [0, 10, 0, 2],
        alignment: 'right',
      },
      { text: 'подпись', fontSize: 8, margin: [0, 0, 30, -2], alignment: 'right' },
      { text: '', pageBreak: 'after' },
      {
        table: {
          widths: ['4%', '17%', 'auto', 'auto', '15%', '6%', '6%', '6%', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: '№ гр.', alignment: 'center', style: 'tabHeader' },
              { text: 'Фамилия, Имя учащегося', alignment: 'center', style: 'tabHeader' },
              { text: 'Телефон учащегося', alignment: 'center', style: 'tabHeader' },
              { text: 'Упражнение', alignment: 'center', style: 'tabHeader' },
              { text: 'Маршрут', alignment: 'center', style: 'tabHeader' },
              { text: 'Начало занятий\nчас.мин', alignment: 'center', style: 'tabHeader' },
              { text: 'конец занятий\nчас.мин', alignment: 'center', style: 'tabHeader' },
              { text: 'Всего часов\nчас.мин', alignment: 'center', style: 'tabHeader' },
              { text: 'Пробег км.', alignment: 'center', style: 'tabHeader' },
              { text: 'Оценка', alignment: 'center', style: 'tabHeader' },
              { text: 'Подпись учащегося', alignment: 'center', style: 'tabHeader' },
            ],
            ...sortedSessions.map((student, index) => {
              const [startTime, endTime] = student.slot.split('-').map(Number);
              const durationMinutes = (endTime - startTime) * 60;
              totalMinutes += durationMinutes;

              return [
                groupNumber,
                `${student.lastName} ${student.firstName}`,
                student.phone,
                '', // Упражнение
                'Город, Площадка',
                `${startTime}:00`,
                `${endTime}:00`,
                `${endTime - startTime}:00`,
                '', // Пробег
                '', // Оценка
                '', // Подпись
              ];
            }),
            (() => {
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
              const totalTimeFormatted = `${hours}:${minutes.toString().padStart(2, '0')}`;

              return [
                { text: 'ИТОГО', colSpan: 7, alignment: 'right' },
                '',
                '',
                '',
                '',
                '',
                '',
                totalTimeFormatted,
                '',
                { text: '', colSpan: 2 },
                '',
              ];
            })(),
          ],
        },
        layout: {
          paddingTop: () => 5,
          paddingBottom: () => 5,
        },
      },
      { text: 'Мастер (водитель) __________________', alignment: 'right', margin: [0, 20, 0, 0] },
    ],
  };
}
