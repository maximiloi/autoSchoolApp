import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function informationForTrafficPoliceTemplate(group, company) {
  const { groupNumber, students } = group;

  const sortedStudents = students.sort((a, b) => a.studentNumber - b.studentNumber);

  return {
    pageOrientation: 'landscape',
    content: [
      { text: `Список группы № ${groupNumber}`, style: 'header' },
      {
        style: 'tableExample',
        margin: [0, 5, 0, 0],
        fontSize: 10,
        table: {
          widths: ['5%', '27%', '10%', '13%', '45%'],
          body: [
            [
              { text: '№ п/п', style: 'tableHeader' },
              { text: 'Фамилия Имя Отчество', style: 'tableHeader' },
              { text: 'Дата рождения', style: 'tableHeader' },
              { text: 'Телефон', style: 'tableHeader' },
              { text: 'Адрес прописки (жительства)', style: 'tableHeader' },
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              { text: `${student.lastName} ${student.firstName} ${student.middleName || ''}` },
              {
                text: format(new Date(student.birthDate), 'dd/MM/yyyy', { locale: ru }),
                alignment: 'center',
              },
              { text: student.phone, alignment: 'center' },
              { text: `${student.addressRegion}, ${student.city}` },
            ]),
          ],
        },
      },
      {
        text: `"_____" _________________ ${new Date().getFullYear()} г.                 Генеральный директор: ________________________________________________ /${company.directorSurname} ${company.directorName[0]}. ${company.directorPatronymic ? company.directorPatronymic[0] + '.' : ''}/`,
        margin: [0, 20, 0, 0],
        alignment: 'center',
      },
    ],
    styles: {
      header: { fontSize: 14, bold: true, alignment: 'center' },
      tableHeader: { fontSize: 8, alignment: 'center' },
    },
  };
}
