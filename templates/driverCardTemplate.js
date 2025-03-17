import { format } from 'date-fns';

export default function driverCardTemplate(student, company) {
  const {
    lastName,
    firstName,
    middleName,
    birthDate,
    birthPlace,
    registrationAddress,
    documentIssueDate,
    documentIssuer,
    documentNumber,
    documentSeries,
    medicalIssueDate,
    medicalIssuer,
    medicalNumber,
  } = student;
  const { companyName, whoIssuedLicense, whenIssuedLicense, license } = company;
  const doc = {
    number: 45454545,
    series: 'MASH',
  };

  return {
    pageOrientation: 'landscape',
    styles: {
      pageHeader: { fontSize: 16, bold: true },
      text: { fontSize: 10, bold: true, margin: [0, 2, 0, 2] },
      small: { fontSize: 10, italics: true },
      table: { fontSize: 9, margin: [0, 2, 0, 2], alignment: 'center' },
    },
    content: [
      {
        columns: [
          {
            width: '48%',
            stack: [
              {
                text: 'В О Д И Т Е Л Ь С К А Я    К А Р Т О Ч К А',
                style: 'pageHeader',
                alignment: 'center',
                margin: [0, 0, 0, 5],
              },
              {
                columns: [
                  {
                    width: 100,
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 70,
                            h: 100,
                            lineColor: 'black',
                          },
                        ],
                        margin: [15, 10, 0, 0],
                      },
                      {
                        text: 'фото',
                        alignment: 'center',
                        fontSize: 9,
                        margin: [0, -60, 0, 0],
                      },
                    ],
                    fillColor: 'white',
                  },
                  {
                    stack: [
                      {
                        text: `${lastName} ${firstName} ${middleName}`,
                        fontSize: 14,
                        bold: true,
                        margin: [0, 0, 0, 10],
                      },
                      {
                        text: [
                          { text: 'Дата и место рождения: ', style: 'small' },
                          {
                            text: `${format(new Date(birthDate), 'dd.MM.yyyy')}, ${birthPlace}`,
                            style: 'text',
                          },
                        ],
                        margin: [0, 0, 0, 5],
                      },
                      {
                        text: [
                          { text: 'Место жительства: ', style: 'small' },
                          { text: registrationAddress, style: 'text' },
                        ],
                        margin: [0, 0, 0, 5],
                      },
                      {
                        text: [
                          { text: 'Паспорт: ', style: 'small' },
                          { text: 'Серия ', style: 'text' },
                          { text: documentSeries, style: 'text' },
                          { text: ' № ', style: 'text' },
                          { text: documentNumber, style: 'text' },
                          { text: ', выдан  ', style: 'text' },
                          { text: documentIssuer, style: 'text' },
                          { text: ' от ', style: 'text' },
                          {
                            text: format(new Date(documentIssueDate), 'dd.MM.yyyy'),
                            style: 'text',
                          },
                        ],
                        margin: [0, 0, 0, 5],
                      },
                    ],
                  },
                ],
              },
              {
                text: 'ГИБДД РЭО ОГИБДД ОВД по Окуловскому району',
                fontSize: 12,
                bold: true,
                alignment: 'center',
                margin: [0, 15, 0, 5],
              },
              {
                text: [
                  { text: 'Медицинское освидетельствование прошел: ', style: 'small' },
                  { text: format(new Date(medicalIssueDate), 'dd.MM.yyyy'), style: 'text' },
                  { text: ' выдана: ', style: 'small' },
                  { text: medicalIssuer, style: 'text' },
                  { text: ' № ', style: 'small' },
                  { text: medicalNumber, style: 'text' },
                ],
                margin: [0, 0, 0, 5],
              },
              {
                text: `Прошел обучение по программе: водителей транспортных средств категории "B"'  в ${companyName}, лицензия ${whoIssuedLicense} от ${format(new Date(whenIssuedLicense), 'dd.MM.yyyy')}, номер ${license}`,
                style: 'text',
                margin: [0, 0, 0, 5],
              },
              {
                text: 'Документ о прохождении обучения',
                fontSize: 14,
                bold: true,
                alignment: 'center',
                margin: [0, 5, 0, 5],
              },
              {
                text: `серия ${doc.series} № ${doc.number} от	${format(new Date(medicalIssueDate), 'dd.MM.yyyy')}  личная подпись ____________`,
                style: 'text',
                margin: [0, 0, 0, 5],
              },
              {
                table: {
                  widths: ['15%', '20%', '20%', '30%', '15%'],
                  body: [
                    [
                      { text: 'Дата выдачи', style: 'table' },
                      { text: 'Серия, № водительского удостоверения', style: 'table' },
                      { text: 'Разрешенные категории', style: 'table' },
                      {
                        text: 'Наименование подразделения, выдавшего удостоверение',
                        style: 'table',
                      },
                      { text: 'Подпись должностного лица', style: 'table' },
                    ],
                    [{ text: '', margin: [0, 10, 0, 10] }, '', '', '', ''],
                    [{ text: '', margin: [0, 10, 0, 10] }, '', '', '', ''],
                    [{ text: '', margin: [0, 10, 0, 10] }, '', '', '', ''],
                    [{ text: '', margin: [0, 10, 0, 10] }, '', '', '', ''],
                    [{ text: '', margin: [0, 10, 0, 10] }, '', '', '', ''],
                  ],
                },
              },
              {
                text: 'Примечание: Водительская карточка хранится владельцем удостоверения и предъявляется им в подразделение ГИБДД при замене водительского удостоверения, а также при получении нового удостоверения в замен утраченного (похищенного)',
                style: 'small',
                margin: [0, 5, 0, 0],
              },
            ],
          },
          {
            width: '52%',
            text: '',
          },
        ],
      },
    ],
  };
}
