import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function examListsTemplate(group, company, selectedDate) {
  const { companyName, actualAddress, directorSurname, directorName, directorPatronymic } = company;
  const { category, students } = group;

  if (!selectedDate) return null;

  const cleanedAddress = (address) => address.replace(/^\d{6},\s*/, '');
  const sortedStudents = students.sort((a, b) => a.studentNumber - b.studentNumber);
  const examDate = new Date(selectedDate);

  const generateExamBlock = (examType) => [
    { text: 'Начальнику ОГИБДД ОМВД РФ', style: 'pageHeader', alignment: 'right' },
    { text: 'по Окуловскому району', style: 'pageHeader', alignment: 'right' },
    { text: 'майору полиции Рыжову С.М.', style: 'pageHeader', alignment: 'right' },
    { text: 'СПИСОК', style: 'header', margin: [0, 15, 0, 0] },
    {
      text: `кандидатов в водители, включенных в состав организованной группы`,
      style: 'header',
    },
    {
      text: `${companyName}, ${cleanedAddress(actualAddress)}`,
      style: 'subHeader',
    },
    {
      text: `направляется список кандидатов в водители в составе организованной группы для сдачи экзаменов на право управления транспортными средствами категория "${category}"`,
      style: 'subHeader',
    },
    {
      text: [
        { text: 'Дата и время проведения экзамена: ', bold: true },
        format(new Date(examDate), 'dd MMMM yyyy года', { locale: ru }),
      ],
      style: 'subHeader',
      margin: [0, 10, 0, 0],
    },
    {
      text: [{ text: 'Вид экзамена: ', bold: true }, examType],
      style: 'subHeader',
      margin: [0, 10, 0, 0],
    },
    {
      style: 'tableExample',
      margin: [0, 15, 0, 0],
      fontSize: 10,
      table: {
        widths: ['8%', '*', '*', '*', '*'],
        body: [
          [
            { text: '№ п/п', style: 'tableHeader' },
            { text: 'Фамилия', style: 'tableHeader' },
            { text: 'Имя', style: 'tableHeader' },
            { text: 'Отчество', style: 'tableHeader' },
            { text: 'Дата рождения', style: 'tableHeader' },
          ],
          ...sortedStudents.map((student, index) => [
            { text: index + 1, alignment: 'center' },
            { text: student.lastName },
            { text: student.firstName },
            { text: student.middleName || '' },
            {
              text: format(new Date(student.birthDate), 'dd/MM/yyyy', { locale: ru }),
              alignment: 'center',
            },
          ]),
        ],
      },
    },
    {
      text: `${format(new Date(examDate - 1), 'dd MMMM yyyy г.', { locale: ru })}           Генеральный директор: ________________________________ /${directorSurname} ${directorName[0]}. ${directorPatronymic ? directorPatronymic[0] + '.' : ''}/`,
      margin: [0, 20, 0, 0],
      alignment: 'center',
    },
  ];

  return {
    defaultStyle: {
      fontSize: 12,
    },
    styles: {
      pageHeader: { fontSize: 12, bold: true },
      header: { fontSize: 14, bold: true, alignment: 'center' },
      subHeader: { fontSize: 12, alignment: 'center', margin: [0, 5, 0, 0] },
      tableHeader: { fontSize: 10, alignment: 'center' },
    },
    content: [
      ...generateExamBlock('теоретический первично'),
      { text: '', pageBreak: 'after' },
      ...generateExamBlock('практический экзамен'),
    ],
  };
}
