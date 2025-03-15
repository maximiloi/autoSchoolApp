import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { SCHEDULE } from '@/lib/schedule';
console.log('🚀 ~ SCHEDULE:', SCHEDULE);

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
  const numberOfStudents = students.length;
  console.log('🚀 ~ journeyTemplate ~ numberOfStudents:', numberOfStudents);
  const fullNameTeacher =
    lastName !== '-' && firstName !== '-'
      ? `${lastName} ${firstName[0]}. ${middleName !== '-' ? middleName[0] + '.' : ''}`
      : '';

  return {
    pageOrientation: 'landscape',
    styles: {
      pageHeader: { fontSize: 12, bold: true },
      header: { fontSize: 22, bold: true, alignment: 'center' },
      subHeader: { fontSize: 16, alignment: 'center' },
      item: { fontSize: 12, margin: [0, 2, 0, 2] },
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
              { text: '2', alignment: 'right' },
            ],
            [{ text: 'Учебные предметы базового курса', style: 'subHeader', colSpan: 2 }, {}],
            [
              {
                text: 'Учебный предмет "Основы законодательства в сфере дорожного движения"',
                style: 'item',
              },
              { text: '3', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Психофизиологические основы деятельности водителя"',
                style: 'item',
              },
              { text: '4', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Основы управления транспортными средствами"',
                style: 'item',
              },
              { text: '5', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Первая помощь при дорожно-транспортном происшествии"',
                style: 'item',
              },
              { text: '6', alignment: 'right' },
            ],
            [{ text: 'Учебные предметы специального цикла', style: 'subHeader', colSpan: 2 }, {}],
            [
              {
                text: 'Учебный предмет "Устройство и техническое обслуживание транспортных средств категории "В" как объектов управления"',
                style: 'item',
              },
              { text: '7', alignment: 'right' },
            ],
            [
              {
                text: 'Учебный предмет "Основы управления транспортными средствами категории B"',
                style: 'item',
              },
              { text: '8', alignment: 'right' },
            ],
            [
              { text: 'Учебные предметы профессионального цикла', style: 'subHeader', colSpan: 2 },
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
              { text: 'Учет вождения', style: 'item', bold: true },
              { text: '', alignment: 'right' },
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
              { text: 'дата рождения', style: 'tableHeader' },
              { text: 'образование', style: 'tableHeader' },
              { text: 'место работы', style: 'tableHeader' },
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
            text: `Учебный предмет: `,
            fontSize: 10,
            alignment: 'left',
          },
          {
            text: `Фамилия преподавателя: ${fullNameTeacher}`,
            fontSize: 10,
            alignment: 'right',
          },
        ],
      },
    ],
  };
}
