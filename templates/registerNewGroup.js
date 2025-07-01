import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function registerNewGroup(group, company, gibddData) {
  if (!group || !company || !gibddData) {
    console.error('Ошибка: загрузки данных');
    return null;
  }

  const {
    companyName,
    legalAddress,
    phone,
    license,
    directorSurname,
    directorName,
    directorPatronymic,
  } = company;
  const {
    groupNumber,
    startTrainingDate,
    endTrainingDate,
    students,
    theoryTeachers: [
      {
        lastName: theoryLastName,
        firstName: theoryFirstName,
        middleName: theoryMiddleName,
        licenseNumber: theoryLicenseNumber,
        licenseSeries: theoryLicenseSeries,
      } = {},
    ] = [{}],
    practiceTeachers: [
      {
        lastName: practiceLastName,
        firstName: practiceFirstName,
        middleName: practiceMiddleName,
        licenseNumber: practiceLicenseNumber,
        licenseSeries: practiceLicenseSeries,
        cars: [{ carModel, carNumber }],
      } = {},
    ] = [{}],
  } = group;
  const { departmentName, officerRank, officerName } = gibddData;

  const fullNameTheoryTeacher =
    `${theoryLastName} ${theoryFirstName} ${theoryMiddleName || ''}`.trim();
  const fullNamePracticeTeacher =
    `${practiceLastName} ${practiceFirstName} ${practiceMiddleName || ''}`.trim();
  const fullNameDirector =
    `${directorSurname} ${directorName[0]}. ${directorPatronymic ? directorPatronymic[0] + '.' : ''}`.trim();

  return {
    styles: {
      header: { fontSize: 12, bold: true },
      subheader: { fontSize: 16, margin: [0, 5, 0, 5] },
    },
    content: [
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: companyName, alignment: 'left', style: 'header' },
              { text: legalAddress, alignment: 'left', style: 'header' },
              { text: `телефон: ${phone}`, alignment: 'left', style: 'header' },
            ],
          },
          {
            width: '50%',
            stack: [
              {
                text: `Начальнику ${departmentName?.replace(',', '\n')}`,
                style: 'pageHeader',
                alignment: 'right',
              },
              { text: `${officerRank} ${officerName}`, style: 'pageHeader', alignment: 'right' },
            ],
          },
        ],
      },
      {
        text: [
          'Прошу зарегистрировать учебную группу № ',
          { text: groupNumber, bold: true },
          ' по обучению водителей транспортных средств ',
          { text: 'категории "В"', bold: true },
        ],
        margin: [0, 50, 0, 0],
      },
      {
        text: [
          'Лицензия министерства образования Новгородской области: ',
          { text: license, bold: true },
        ],
      },
      {
        text: ['Контингент учащихся: ', { text: students.length, bold: true }, ' человек'],
      },
      {
        text: [
          'Начало занятий: ',
          { text: format(startTrainingDate, 'PPPP', { locale: ru }), bold: true },
        ],
        margin: [0, 15, 0, 0],
      },
      {
        text: [
          'Окончание занятий: ',
          { text: format(endTrainingDate, 'PPPP', { locale: ru }), bold: true },
        ],
      },

      {
        text: 'Преподаватель по устройству, техобслуживанию автотранспортных средств, правилам и основам безопасности дорожного движения:',
        bold: true,
        margin: [0, 30, 0, 0],
      },
      {
        text: [
          { text: fullNameTheoryTeacher, bold: true },
          ' высшее (инженер-механик), более 30 лет',
        ],
        margin: [0, 15, 0, 0],
      },
      {
        text: [
          'водительское удостоверение: ',
          { text: `${theoryLicenseSeries} ${theoryLicenseNumber}`, bold: true },
        ],
      },

      {
        text: 'Мастера производственного обучения вождению легкового автомобиля:',
        bold: true,
        margin: [0, 30, 0, 0],
      },
      {
        text: [{ text: fullNamePracticeTeacher, bold: true }, ' среднее-специальное, более 20 лет'],
        margin: [0, 15, 0, 0],
      },
      {
        text: [
          'водительское удостоверение: ',
          { text: `${practiceLicenseSeries} ${practiceLicenseNumber}`, bold: true },
        ],
      },
      {
        columns: [
          {
            width: '27%',
            stack: [{ text: 'Автомобили:' }, { text: '(спецоборудованы)' }],
          },
          {
            width: '3%',
            stack: [{ text: '' }],
          },
          {
            width: '30%',
            stack: [{ text: carModel, bold: true }],
          },
          {
            width: '3%',
            stack: [{ text: '' }],
          },
          {
            width: '30%',
            stack: [{ text: carNumber, bold: true }],
          },
        ],
        margin: [0, 30, 0, 0],
      },
      {
        text: `"_____" ____________ ${new Date().getFullYear()} г.                 Генеральный директор: _________________ /${fullNameDirector}/`,
        margin: [0, 50, 0, 0],
        alignment: 'center',
      },
    ],
  };
}
