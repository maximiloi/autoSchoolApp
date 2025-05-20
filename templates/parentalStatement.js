import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function parentalStatement(student, toast) {
  if (!student) {
    toast?.({ variant: 'destructive', description: 'Отсутствует объект student' });
    return null;
  }

  const missingFields = [];

  if (!student.lastName) missingFields.push('фамилия');
  if (!student.firstName) missingFields.push('имя');
  if (!student.birthDate) missingFields.push('дата рождения');
  if (!student.documentSeries) missingFields.push('серия паспорта');
  if (!student.documentNumber) missingFields.push('номер паспорта');
  if (!student.documentIssuer) missingFields.push('кем выдан паспорт');
  if (!student.documentIssueDate) missingFields.push('дата выдачи паспорта');
  if (!student.documentCode) missingFields.push('код подразделения');
  if (!student.registrationAddress) missingFields.push('адрес регистрации');

  if (missingFields.length > 0) {
    toast?.({
      variant: 'destructive',
      title: 'Недостаточно данных',
      description: `Отсутствуют поля: ${missingFields.join(', ')}`,
    });
    return null;
  }

  const year = new Date().getFullYear();

  return {
    styles: {
      header: { fontSize: 14, bold: true },
    },
    content: [
      {
        text: 'Начальнику ГИБДД ОМВД России по\nОкуловскому району майору полиции\nРыжову С.М.',
        style: 'header',
        alignment: 'right',
      },
      {
        alignment: 'right',
        margin: [0, 20, 0, 20],
        text: [
          'от _______________________________________________\n',
          {
            text: 'ф.и.о.                                                          .\n',
            fontSize: 8,
          },
          'проживающего: _________________________________\n',
          '_______________________________________________\n',
          '_______________________________________________\n',
          '_______________________________________________',
        ],
        lineHeight: 1.5,
      },
      { text: 'Согласие', style: 'header', margin: [0, 10, 0, 10], alignment: 'center' },
      {
        text: 'Я, ________________________________________________________________ , _______ ____________ _______\n',
      },
      {
        text: [
          { text: '.', color: '#FFFFFF' }, // невидимая белая точка
          '                                                                                              ф.и.o.                                                                                                             дата рождения\n',
        ],
        fontSize: 8,
        margin: [0, -2, 0, 3],
        lineHeight: 1.5,
      },
      {
        text: [
          'Паспорт серия _______ № ____________ выданный ____________________________________________\n' +
            '______________________________________________________, _____ _____ ________ (дата выдачи), код подразделения ______ ______ , зарегистрированный: ________________________________________ ______________________________________________________________________________________________\n\n' +
            'В соответствии с требованиями ст.18 Постановления Правительства РФ от 24.10.2014 года № 1097 даю согласие несовершеннолетнему ' +
            `${student.lastName} ${student.firstName} ${student.middleName || ''}, ${format(new Date(student.birthDate), 'dd MMMM yyyy', { locale: ru })} года рождения, паспорт серия ${student.documentSeries} № ${student.documentNumber} выданный ${student.documentIssuer}${format(new Date(student.documentIssueDate), ' dd MMMM yyyy', { locale: ru })} года, код подразделения ${student.documentCode}, зарегистрированного: ${student.registrationAddress} ` +
            'на обучение в автошколе с последующей сдачей внутренних экзаменов и сдачей квалифицированных экзаменов в ГИБДД для последующего получения водительского удостоверения категории «В», оформление подписей и получение документов, а также совершение всех необходимых действий.\n\n',
          `дата: ________________ 20${String(year).slice(2)} г.     подпись: ___________________`,
        ],
        lineHeight: 1.5,
      },
    ],
  };
}
