import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function travelSheet(date, group) {
  if (!date || !group) {
    console.error('Ошибка: загрузки данных');
    return null;
  }

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

  return {
    pageOrientation: 'landscape',
    styles: {
      header: { fontSize: 16, bold: true },
      stamp: { fontSize: 8, margin: [0, 75, 0, 0] },
      tabHeader: { fontSize: 8 },
    },
    content: [
      {
        columns: [
          {
            width: '24%',
            text: 'место для штампа организации',
            style: 'stamp',
            alignment: 'center',
          },
          {
            width: '40%',
            stack: [
              {
                text: `ПУТЕВОЙ ЛИСТ № ${groupNumber}${format(new Date(date), 'ddMM')}`,
                style: 'header',
              },
              { text: 'на учебный автомобиль', style: 'header' },
              {
                text: [{ text: 'Марка автомобиля: ', bold: true }, carModel],
                margin: [0, 5, 0, 0],
              },
              { text: [{ text: 'Государственный №: ', bold: true }, carNumber] },
              { text: [{ text: 'Мастер: ', bold: true }, fullNamePracticeTeachers] },
              {
                text: [
                  { text: 'Водительское удостоверение: ', bold: true },
                  licensePracticeTeachers,
                ],
              },
              { text: [{ text: 'СНИЛС: ', bold: true }, snilsPracticeTeachers] },
              { text: 'Время выезда из гаража ч. мин.  ____-____', margin: [0, 5, 0, 0] },
              { text: 'Время возвращения в гараж ч. мин.  ____-____', margin: [0, 5, 0, 0] },
            ],
          },
          {
            width: '*',
            stack: [
              {
                text: `${format(new Date(date), "d MMMM yyyy 'г.'", { locale: ru })}`,
                style: 'header',
              },
              {
                text: 'Предрейсовый контроль технического состояния ТС пройден:',
                margin: [0, 5, 0, 0],
              },
              { text: '_________________________________________________', margin: [0, 2, 0, 0] },
              {
                text: 'время	         	подпись	            	расшифровка подписи',
                fontSize: 8,
                margin: [0, -3, 0, 0],
              },
              {
                text: 'Прошел предсменный медицинский осмотр, к исполнению трудовых обязанностей допущен:',
                margin: [0, 5, 0, 0],
              },
              { text: '_________________________________________________', margin: [0, 2, 0, 0] },
              {
                text: 'время	         	подпись	            	расшифровка подписи',
                fontSize: 8,
                margin: [0, -3, 0, 0],
              },
              { text: 'Прошел послерейсовый медицинский осмотр:', margin: [0, 5, 0, 0] },
              { text: '_________________________________________________', margin: [0, 2, 0, 0] },
              {
                text: 'время	         	подпись	            	расшифровка подписи',
                fontSize: 8,
                margin: [0, -3, 0, 0],
              },
            ],
          },
        ],
        columnGap: 10,
      },
      {
        text: [
          { text: 'Показания спидометра: ', bold: true },
          { text: '    ' },
          { text: 'а) при выезде из гаража: ', bold: true },
          { text: ' ___________ км ' },
          { text: '    ' },
          { text: 'б) при возвращении в гараж:', bold: true },
          { text: ' ___________ км' },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        table: {
          widths: ['5%', '25%', '10%', '25%', '25%', '10%'],
          body: [
            [
              {
                text: 'Задание мастеру',
                colSpan: 3,
                bold: true,
                alignment: 'center',
              },
              '',
              '',
              { text: 'Горючее', rowSpan: 2, bold: true, alignment: 'center' },
              {
                text: 'Отметки о простоях',
                colSpan: 2,
                bold: true,
                alignment: 'center',
              },
              '',
            ],
            [
              { text: 'Группы', fontSize: 8 },
              { text: 'Фамилия и инициалы учащихся', fontSize: 8 },
              { text: '№№ упражнений', fontSize: 8 },
              '',
              { text: 'Причина простоя в гараже или на линии', fontSize: 8 },
              { text: 'Время простоя', fontSize: 8 },
            ],
            [
              ' ',
              '',
              '',
              {
                text: [
                  { text: 'Наличие в баке\t______\tлитр.\n\n', bold: true },
                  { text: 'Получено:\n' },
                  { text: '1.\t__________________\tлитр.\n' },
                  { text: '2.\t__________________\tлитр.\n\n' },
                  {
                    text: '_________________________________\n',
                    margin: [0, 2, 0, 0],
                  },
                  {
                    text: 'подпись\n\n',
                    fontSize: 8,
                    margin: [0, -3, 0, 0],
                  },
                  { text: 'Остаток горючего в баке по окончании работы\t______\tлитр.\n\n' },
                  {
                    text: '_________________________________\n',
                    margin: [0, 2, 0, 0],
                  },
                  {
                    text: 'подпись\n\n',
                    fontSize: 8,
                    margin: [0, -3, 0, 0],
                  },
                ],
                rowSpan: 12,
              },
              '',
              '',
            ],
            [' ', '', '', '', '', ''],
            [' ', '', '', '', '', ''],
            [' ', '', '', '', '', ''],
            [' ', '', '', '', '', ''],
            [' ', '', '', '', '', ''],
            [' ', '', '', '', '', ''],
            [' ', '', '', '', '', ''],
            [
              ' ',
              '',
              '',
              '',
              {
                text: 'Отметки о контрольных заездах в автошколу и гараж',
                colSpan: 2,
                fontSize: 8,
              },
              '',
            ],
            [' ', '', '', '', '', ''],
            [' ', '', '', '', '', ''],
            [' ', '', '', '', '', ''],
          ],
        },
        layout: 'grid',
        margin: [0, 10, 0, 0],
      },
      {
        text: 'Дополнительное задание мастеру	____________________________________________________________',
      },
      {
        text: 'Руководитель учебного заведения		____________________________________________________________',
      },
      {
        text: 'Вид сообщения	__________________________________________________ Вид перевозки		__________________________________________________',
      },
      {
        text: 'ВЫПОЛНЕНИЕ ЗАДАНИЯ',
        bold: true,
        alignment: 'center',
        pageBreak: 'before',
      },
      {
        table: {
          headerRows: 2,
          widths: [
            '5.45%',
            '18.18%',
            '9.09%',
            '4.55%',
            '4.55%',
            '4.55%',
            '4.55%',
            '14.55%',
            '5.45%',
            '7.27%',
            '10.91%',
            '10.91%',
          ],
          body: [
            [
              { text: '№№ группы', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              {
                text: 'Фамилия и инициалы учащихся',
                rowSpan: 2,
                alignment: 'center',
                style: 'tabHeader',
              },
              { text: 'Упражнение №', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Начало занятий', colSpan: 2, alignment: 'center', style: 'tabHeader' },
              {},
              { text: 'Конец занятий', colSpan: 2, alignment: 'center', style: 'tabHeader' },
              {},
              { text: 'Всего часов', colSpan: 2, alignment: 'center', style: 'tabHeader' },
              {},
              { text: 'Пройдено километров', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Оценка', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Подписи учащихся', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
            ],
            [
              {},
              {},
              {},
              { text: 'Час.', alignment: 'center', style: 'tabHeader' },
              { text: 'Мин.', alignment: 'center', style: 'tabHeader' },
              { text: 'Час.', alignment: 'center', style: 'tabHeader' },
              { text: 'Мин.', alignment: 'center', style: 'tabHeader' },
              { text: 'Часов прописью', alignment: 'center', style: 'tabHeader' },
              { text: 'Мин.', alignment: 'center', style: 'tabHeader' },
              {},
              {},
              {},
            ],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          ],
        },
        layout: 'grid',
      },
      {
        columns: [
          { width: '*', text: '' },
          {
            width: '33%',
            stack: [
              { text: 'Мастер', alignment: 'left', margin: [0, 0, 0, 10] },
              {
                columns: [
                  {
                    width: '45%',
                    stack: [
                      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 1 }] },
                      { text: 'подпись', alignment: 'center', fontSize: 9 },
                    ],
                  },
                  { width: '10%', text: '' },
                  {
                    width: '45%',
                    stack: [
                      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 100, y2: 0, lineWidth: 1 }] },
                      { text: 'расшифровка подписи', alignment: 'center', fontSize: 9 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        margin: [0, 10, 0, 0],
      },
      {
        text: 'РЕЗУЛЬТАТЫ РАБОТЫ',
        bold: true,
        alignment: 'center',
        margin: [0, 20, 0, 0],
      },
      {
        table: {
          headerRows: 3,
          widths: [
            '7.89%',
            '7.89%',
            '7.89%',
            '7.89%',
            '13.16%',
            '7.89%',
            '7.89%',
            '7.89%',
            '7.89%',
            '7.89%',
            '7.89%',
            '7.89%',
          ],
          body: [
            [
              { text: 'Часы', colSpan: 5, alignment: 'center', style: 'tabHeader' },
              {},
              {},
              {},
              {},
              { text: 'Пробег (км.)', colSpan: 3, alignment: 'center', style: 'tabHeader' },
              {},
              {},
              {
                text: 'Расход горючего',
                colSpan: 4,
                alignment: 'center',
                style: 'tabHeader',
              },
              {},
              {},
              {},
            ],
            [
              { text: 'В наряде', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'В движении', colSpan: 2, alignment: 'center', style: 'tabHeader' },
              {},
              { text: 'Простои', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              {
                text: 'В том числе по технической неисправности',
                rowSpan: 2,
                alignment: 'center',
                style: 'tabHeader',
              },
              { text: 'Общий', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'В том числе', colSpan: 2, alignment: 'center', style: 'tabHeader' },
              {},
              { text: 'По норме', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Фактически', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Экономия', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
              { text: 'Перерасход', rowSpan: 2, alignment: 'center', style: 'tabHeader' },
            ],
            [
              {},
              { text: 'учебные без груза', alignment: 'center', style: 'tabHeader' },
              { text: 'учебные с грузом', alignment: 'center', style: 'tabHeader' },
              {},
              {},
              {},
              { text: 'учебные без груза', alignment: 'center', style: 'tabHeader' },
              { text: 'учебные с грузом', alignment: 'center', style: 'tabHeader' },
              {},
              {},
              {},
              {},
            ],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
          ],
        },
        layout: 'grid',
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [
              {
                stack: [
                  { text: 'Зам руководителя', alignment: 'center', margin: [0, 5, 0, 2] },
                  {
                    columns: [
                      { text: '________________', alignment: 'center' },
                      { text: '_________________________', alignment: 'center' },
                    ],
                    margin: [0, 0, 0, 2],
                  },
                  {
                    columns: [
                      { text: 'подпись', alignment: 'center', fontSize: 8, margin: [0, -3, 0, 0] },
                      {
                        text: 'расшифровка подписи',
                        alignment: 'center',
                        fontSize: 8,
                        margin: [0, -3, 0, 0],
                      },
                    ],
                  },
                ],
              },
              {
                stack: [
                  { text: 'Бухгалтер', alignment: 'center', margin: [0, 5, 0, 2] },
                  {
                    columns: [
                      { text: '________________', alignment: 'center' },
                      { text: '_________________________', alignment: 'center' },
                    ],
                    margin: [0, 0, 0, 2],
                  },
                  {
                    columns: [
                      { text: 'подпись', alignment: 'center', fontSize: 8, margin: [0, -3, 0, 0] },
                      {
                        text: 'расшифровка подписи',
                        alignment: 'center',
                        fontSize: 8,
                        margin: [0, -3, 0, 0],
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 10, 0, 0],
      },
    ],
  };
}
