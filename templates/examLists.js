import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function examListsTemplate(group, company, selectedDate, examType) {
  const { companyName, actualAddress, directorSurname, directorName, directorPatronymic } = company;

  if (!selectedDate) return null;

  const cleanedAddress = (address) => address.replace(/^\d{6},\s*/, '');
  const sortedStudents = group.sort((a, b) => a.lastName - b.lastName);
  const examDate = new Date(selectedDate);

  const generateExamDocument = (examType) => [
    { text: 'Начальнику ОГИБДД ОМВД РФ', style: 'pageHeader', alignment: 'right' },
    { text: 'по Окуловскому району', style: 'pageHeader', alignment: 'right' },
    { text: 'майору полиции Рыжову С.М.', style: 'pageHeader', alignment: 'right' },
    { text: 'ЗАЯВЛЕНИЕ', style: 'header', margin: [0, 15, 0, 0] },
    {
      text: `кандидатов в водители, включенных в состав организованной группы`,
      style: 'header',
    },
    {
      text: `${companyName}, ${cleanedAddress(actualAddress)}`,
      style: 'subHeader',
    },
    {
      text: `направляется список кандидатов в водители в составе организованной группы для сдачи экзаменов на право управления транспортными средствами категория "B"`,
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
        widths: ['7.5%', '11%', '*', '*', '*', '*'],
        body: [
          [
            { text: '№ п/п', style: 'tableHeader' },
            { text: '№ группы', style: 'tableHeader' },
            { text: 'Фамилия', style: 'tableHeader' },
            { text: 'Имя', style: 'tableHeader' },
            { text: 'Отчество', style: 'tableHeader' },
            { text: 'Дата рождения', style: 'tableHeader' },
          ],
          ...sortedStudents.map((student, index) => [
            { text: index + 1, alignment: 'center' },
            { text: student.groupNumber, alignment: 'center' },
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
      text: `"_____" _______________ ${new Date().getFullYear()} г.\n\nГенеральный директор: __________________________ /${directorSurname} ${directorName[0]}. ${directorPatronymic ? directorPatronymic[0] + '.' : ''}/`,
      margin: [0, 20, 0, 0],
      alignment: 'right',
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
    content: [...generateExamDocument(examType)],
  };
}
