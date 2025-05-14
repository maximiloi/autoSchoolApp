export default function informationForTrafficPoliceTemplate(group, company) {
  const { groupNumber, students } = group;

  const sortedStudents = students.sort((a, b) => a.studentNumber - b.studentNumber);

  return {
    content: [
      { text: `Список группы № ${groupNumber}`, style: 'header' },
      {
        style: 'tableExample',
        margin: [0, 5, 0, 0],
        fontSize: 10,
        table: {
          widths: ['5%', '35%', '18%', '45%'],
          body: [
            [
              { text: '№ п/п', style: 'tableHeader' },
              { text: 'Фамилия Имя Отчество', style: 'tableHeader' },
              { text: 'Телефон', style: 'tableHeader' },
              { text: 'Адрес прописки (жительства)', style: 'tableHeader' },
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              { text: `${student.lastName} ${student.firstName} ${student.middleName || ''}` },
              { text: student.phone },
              { text: `${student.addressRegion} ${student.city}` },
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
