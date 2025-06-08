import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import QRCode from 'qrcode';

export default async function applicationForm(student, toast, botUsername) {
  if (!student) {
    toast?.({ variant: 'destructive', description: 'Отсутствует объект student' });
    return null;
  }

  const missingFields = [];

  if (!student.lastName) missingFields.push('фамилия');
  if (!student.firstName) missingFields.push('имя');
  if (!student.birthDate) missingFields.push('дата рождения');
  if (!student.birthPlace) missingFields.push('место рождения');
  if (!student.documentSeries) missingFields.push('серия паспорта');
  if (!student.documentNumber) missingFields.push('номер паспорта');
  if (!student.documentCode) missingFields.push('код подразделения');
  if (!student.documentIssuer) missingFields.push('кем выдан паспорт');
  if (!student.documentIssueDate) missingFields.push('дата выдачи паспорта');
  if (!student.registrationAddress) missingFields.push('адрес регистрации');
  if (!student.phone) missingFields.push('телефон');

  if (missingFields.length > 0) {
    toast?.({
      variant: 'destructive',
      title: 'Недостаточно данных',
      description: `Отсутствуют поля: ${missingFields.join(', ')}`,
    });
    return null;
  }

  const telegramLink = `https://t.me/${botUsername}?start=${student.id}`;
  const qrDataUrl = await QRCode.toDataURL(telegramLink);

  return {
    content: [
      { text: 'ЗАЯВЛЕНИЕ - АНКЕТА', style: 'header', alignment: 'center' },
      {
        text: 'Прошу принять меня на курсы подготовки водителей категории "B"',
        style: 'subheader',
        alignment: 'center',
      },
      {
        text: 'Обучаться практическому вождению в дневное время согласен.',
        style: 'subheader',
        alignment: 'center',
      },
      { text: 'О себе сообщаю следующие данные:', style: 'subheader' },
      {
        table: {
          widths: ['30%', '70%'],
          body: [
            [
              { text: '1. Ф.И.О.', bold: true, margin: [0, 2, 0, 2] },
              {
                text: `${student.lastName} ${student.firstName} ${student.middleName || ''}`,
                margin: [0, 2, 0, 2],
              },
            ],
            [
              { text: '2. Место рождения', bold: true, margin: [0, 2, 0, 2] },
              { text: student.birthPlace, margin: [0, 2, 0, 2] },
            ],
            [
              { text: '3. Дата рождения', bold: true, margin: [0, 2, 0, 2] },
              {
                text: format(new Date(student.birthDate), 'dd/MM/yyyy', { locale: ru }),
                margin: [0, 2, 0, 2],
              },
            ],
            [
              { text: '4. Паспорт', bold: true, margin: [0, 2, 0, 2] },
              {
                text: `серия: ${student.documentSeries}  номер: ${student.documentNumber}  выдан: ${format(new Date(student.documentIssueDate), 'dd MMMM yyyy года.', { locale: ru })} ${student.documentIssuer} код подразделения: ${student.documentCode}`,
                margin: [0, 2, 0, 2],
              },
            ],
            [
              { text: '5. Адрес', bold: true, margin: [0, 2, 0, 2] },
              { text: student.registrationAddress, margin: [0, 2, 0, 2] },
            ],
            [
              { text: '6. Телефон', bold: true, margin: [0, 2, 0, 2] },
              { text: student.phone, margin: [0, 2, 0, 2] },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 0,
          hLineColor: () => 'gray',
        },
      },
      {
        columns: [
          {
            text: [{ text: 'Дата: ', bold: true }, format(new Date(), 'PPP', { locale: ru })],
          },
          {
            text: [
              {
                text: ` ______________________ /${student.lastName} ${student.firstName[0]}. ${student.middleName ? student.middleName[0] + '.' : ''}/`,
                italics: true,
              },
            ],
            alignment: 'right',
          },
        ],
        margin: [0, 30, 0, 0],
      },
      {
        columns: [
          {
            text: 'Отсканируйте QR-код для получения уведомлений в Telegram от автошколы:\n\n• Уведомления о начале учебного курса\n• Уведомления о запланированных вождениях\n• Напоминания об оплате 10 и 25 числа',
            margin: [0, 50, 0, 10],
          },
          {
            image: qrDataUrl,
            width: 150,
            margin: [0, 30, 0, 0],
          },
        ],
      },
    ],
    styles: {
      header: { fontSize: 20, bold: true },
      subheader: { fontSize: 16, margin: [0, 5, 0, 5] },
    },
  };
}
