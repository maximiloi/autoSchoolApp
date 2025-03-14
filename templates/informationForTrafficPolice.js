import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function informationForTrafficPoliceTemplate(group, company) {
  const { companyName, actualAddress } = company;
  const { category, startTrainingDate, endTrainingDate, students } = group;

  const cleanedAddress = (address) => address.replace(/^\d{6},\s*/, '');
  const sortedStudents = students.sort((a, b) => a.studentNumber - b.studentNumber);

  return {
    pageOrientation: 'landscape',
    content: [
      { text: 'Начальнику ОГИБДД ОМВД РФ', style: 'pageHeader', alignment: 'right' },
      { text: 'по Окуловскому району', style: 'pageHeader', alignment: 'right' },
      { text: 'майору полиции Рыжову С.М.', style: 'pageHeader', alignment: 'right' },
      { text: 'СВЕДЕНИЯ', style: 'header' },
      {
        text: `о лицах, обучающих по программе подготовки водителей транспортных средств категории "${category}"`,
        style: 'header',
      },
      {
        text: `Организация: ${companyName} ${cleanedAddress(actualAddress)}`,
        style: 'subHeader',
        margin: [0, 2, 0, 0],
      },
      {
        text: `Категория (подкатегория) ТС "${category}" Дата начала обучения: ${format(new Date(startTrainingDate), 'dd/MM/yyyy', { locale: ru })}. Дата окончания: ${format(new Date(endTrainingDate), 'dd/MM/yyyy', { locale: ru })}.`,
        style: 'subHeader',
        margin: [0, 0, 0, 2],
      },
      {
        style: 'tableExample',
        margin: [0, 5, 0, 0],
        fontSize: 10,
        table: {
          widths: [
            '3%',
            '8%',
            '8%',
            '8%',
            '3.5%',
            '9%',
            '13%',
            '4%',
            '8%',
            '8%',
            '12.5%',
            '6%',
            '9%',
          ],
          body: [
            [
              { rowSpan: 2, text: '№ п/п', style: 'tableHeader' },
              { colSpan: 7, text: 'Анкетные данные', style: 'tableHeader' },
              {},
              {},
              {},
              {},
              {},
              {},
              { colSpan: 5, text: 'Документ, удостоверяющий личность', style: 'tableHeader' },
              {},
              {},
              {},
              {},
            ],
            [
              {},
              { text: 'Фамилия', style: 'tableHeader' },
              { text: 'Имя', style: 'tableHeader' },
              { text: 'Отчество', style: 'tableHeader' },
              { text: 'Пол', style: 'tableHeader' },
              { text: 'Дата рождения', style: 'tableHeader' },
              { text: 'Место рождения', style: 'tableHeader' },
              { text: 'Гражданство', style: 'tableHeader' },
              { text: 'Наименование документа', style: 'tableHeader' },
              { text: 'Серия, номер', style: 'tableHeader' },
              { text: 'Кем выдан', style: 'tableHeader' },
              { text: 'Код подразделения', style: 'tableHeader' },
              { text: 'Дата выдачи', style: 'tableHeader' },
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              { text: student.lastName },
              { text: student.firstName },
              { text: student.middleName || '' },
              { text: student.gender === 'male' ? 'М' : 'Ж', alignment: 'center' },
              {
                text: format(new Date(student.birthDate), 'dd/MM/yyyy', { locale: ru }),
                alignment: 'center',
              },
              { text: student.birthPlace },
              { text: 'РФ', alignment: 'center' },
              { text: student.documentType === 'passport' ? 'паспорт РФ' : 'паспорт Азербайджана' },
              { text: `${student.documentSeries} ${student.documentNumber}` },
              { text: student.documentIssuer },
              { text: student.documentCode },
              {
                text: student.documentIssueDate
                  ? format(new Date(student.documentIssueDate), 'dd/MM/yyyy', { locale: ru })
                  : '',
                alignment: 'center',
              },
            ]),
          ],
        },
      },
      {
        text: `"_____" _________________ ${new Date().getFullYear()} г.                 Генеральный директор: ________________________________________________ /${company.directorSurname} ${company.directorName[0]}. ${company.directorPatronymic ? company.directorPatronymic[0] + '.' : ''}/`,
        margin: [0, 20, 0, 0],
        alignment: 'center',
      },
      { text: '', pageBreak: 'before' },
      {
        style: 'tableExample',
        margin: [0, 5, 0, 0],
        fontSize: 10,
        table: {
          widths: [
            '3%',
            '3.5%',
            '9%',
            '8%',
            '8%',
            '3.5%',
            '3.5%',
            '3.5%',
            '9%',
            '9%',
            '9%',
            '12%',
            '8%',
            '11%',
          ],
          body: [
            [
              { rowSpan: 2, text: '№ п/п', style: 'tableHeader' },
              { colSpan: 7, text: 'Адрес регистрации (пребывания)', style: 'tableHeader' },
              {},
              {},
              {},
              {},
              {},
              {},
              { colSpan: 5, text: 'Медицинское заключение', style: 'tableHeader' },
              {},
              {},
              {},
              {},
              { text: 'Подпись кандидата в водители', style: 'tableHeader' },
            ],
            [
              {},
              { text: 'Cтрана', style: 'tableHeader' },
              { text: 'Регион', style: 'tableHeader' },
              { text: 'Населенный пункт', style: 'tableHeader' },
              { text: 'Улица', style: 'tableHeader' },
              { text: 'дом', style: 'tableHeader' },
              { text: 'корпус', style: 'tableHeader' },
              { text: 'квартира', style: 'tableHeader' },
              { text: 'Серия номер', style: 'tableHeader' },
              { text: 'Дата выдачи', style: 'tableHeader' },
              { text: 'Наименование мед.организации', style: 'tableHeader' },
              { text: 'серия и номер лицензии', style: 'tableHeader' },
              { text: 'серия и номер вод. уд-ния', style: 'tableHeader' },
              {
                text: 'С обработкой персональных данных в соответствии с Фед.законом от 27.07.2006 №152-ФЗ "О персональных данных" согласен',
                style: 'tableHeader',
              },
            ],
            ...sortedStudents.map((student) => [
              { text: student.studentNumber, alignment: 'center' },
              { text: student.country, alignment: 'center' },
              { text: student.addressRegion },
              { text: student.city },
              { text: student.street },
              { text: student.house },
              { text: student.building },
              { text: student.apartment },
              { text: `${student.medicalSeries} ${student.medicalNumber}` },
              {
                text: student.medicalIssueDate
                  ? format(new Date(student.medicalIssueDate), 'dd/MM/yyyy', { locale: ru })
                  : '',
                alignment: 'center',
              },
              { text: student.medicalIssuer },
              { text: `${student.licenseSeries} ${student.license}` },
              { text: '' },
              {
                text: '',
              },
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
      pageHeader: { fontSize: 10, bold: true },
      header: { fontSize: 12, bold: true, alignment: 'center' },
      subHeader: { fontSize: 10 },
      tableHeader: { fontSize: 8, alignment: 'center' },
    },
  };
}
