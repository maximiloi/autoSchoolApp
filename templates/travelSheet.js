export default function travelSheet(date, group, company = {}) {
  if (!date || !group || !company) {
    console.error('Ошибка: загрузки данных');
    return null;
  }

  // const {
  //   companyName,
  //   legalAddress,
  //   phone,
  //   license,
  //   directorSurname,
  //   directorName,
  //   directorPatronymic,
  // } = company;
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

  const fullNameTheoryTeacher =
    `${theoryLastName} ${theoryFirstName} ${theoryMiddleName || ''}`.trim();
  const fullNamePracticeTeacher =
    `${practiceLastName} ${practiceFirstName} ${practiceMiddleName || ''}`.trim();
  // const fullNameDirector =
  //   `${directorSurname} ${directorName[0]}. ${directorPatronymic ? directorPatronymic[0] + '.' : ''}`.trim();

  return {
    pageOrientation: 'landscape',
    styles: {
      header: { fontSize: 12, bold: true },
      subheader: { fontSize: 16, margin: [0, 5, 0, 5] },
    },
    content: [
      {
        text: `"_____" ____________ ${new Date().getFullYear()} г.                 Генеральный директор: _________________ //`,
      },
    ],
  };
}
