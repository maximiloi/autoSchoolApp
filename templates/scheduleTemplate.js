import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function scheduleTemplate(group = { theoryTeachers: [{}] }, company = {}) {
  const { directorSurname = '-', directorName = '-', directorPatronymic = '-' } = company;
  const {
    groupNumber,
    startTrainingDate,
    endTrainingDate,
    theoryTeachers: [{ lastName = '-', firstName = '-', middleName = '-' }],
  } = group;

  const fullNameDirector =
    directorSurname !== '-' && directorName !== '-'
      ? `${directorSurname} ${directorName[0]}. ${directorPatronymic !== '-' ? directorPatronymic[0] + '.' : ''}`
      : '___________________';
  const fullNameTeacher =
    lastName !== '-' && firstName !== '-'
      ? `${lastName} ${firstName[0]}. ${middleName !== '-' ? middleName[0] + '.' : ''}`
      : '';
  const activeGroupNumber = groupNumber ? `${groupNumber}` : `_____`;
  const activeStartTrainingDate = startTrainingDate
    ? `${format(new Date(startTrainingDate), 'dd/MM/yyyy', { locale: ru })}`
    : '____/____/________';
  const activeEndTrainingDate = endTrainingDate
    ? `${format(new Date(endTrainingDate), 'dd/MM/yyyy', { locale: ru })}`
    : '____/____/________';

  return {
    pageOrientation: 'landscape',
    content: [
      { text: 'Утверждено:', style: 'pageHeader', alignment: 'right' },
      {
        text: `Генеральный директор: _____________________ / ${fullNameDirector} /`,
        style: 'pageHeader',
        alignment: 'right',
      },
      { text: 'РАСПИСАНИЕ', style: 'header', alignment: 'center' },
      {
        text: 'подготовки водителей транспортных средств категории «В»',
        style: 'subHeader',
        alignment: 'center',
      },
      {
        text: `Учебной группы № ${activeGroupNumber} ;                 Дни занятий: __________________________________`,
        style: 'subHeader',
        alignment: 'center',
      },
      {
        text: `День начала занятий ${activeStartTrainingDate}                         окончание ${activeEndTrainingDate}`,
        style: 'subHeader',
        alignment: 'center',
      },
      {
        style: 'tableExample',
        margin: [0, 5, 0, 0],
        fontSize: 10,
        table: {
          widths: ['4%', '5%', '6%', '9%', '27%', '39%', '5%', '5%'],
          body: [
            [
              { text: '№ тем', style: 'tableHeader' },
              { text: 'Дата (день / месяц)', style: 'tableHeader' },
              { text: 'Часы начала занятия', style: 'tableHeader' },
              { text: 'Преподаватель', style: 'tableHeader' },
              { text: 'Наименование учебного предмета', style: 'tableHeader' },
              { text: 'Номера и наименование тем занятий', style: 'tableHeader' },
              { text: 'Кол-во часов', style: 'tableHeader' },
              { text: 'Итого часов', style: 'tableHeader' },
            ],
            [
              { alignment: 'center', text: '\n\n\n1' },
              '',
              { alignment: 'center', text: '\n\n________\n\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства в сфере дорожного движения\n\nПсихофизиологические основы деятельности водителя',
              'Т1.1 Законодательство, определяющее правовые основы обеспечения безопасности дорожного движения в сфере взаимодействия  общества и природы\nТ1.2 Законодательство, устанавливающее ответственность за нарушения в сфере дорожного движения\nТ1. Познавательные функции, система восприятия и психомоторные навыки.',
              { alignment: 'center', text: '1\n\n\n1\n\n2' },
              { alignment: 'center', text: '\n\n\n4' },
            ],
            [
              { alignment: 'center', text: '\n2' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nПсихофизиологические основы деятельности водителя',
              'Т1.2  Законодательство РФ , устанавливающее ответственность за нарушение в сфере дорожного движения\nТ.2 Этические основы деятельности водителя',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n\n\n3' },
              '',
              { alignment: 'center', text: '\n________\n\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nУстройство и техническое обслуживание транспорт ных средств категории "В" как объектов управления',
              'Т2.1 Общие положения, основные понятия и термины, используемые в Правилах дорожного движения\nТ1.1 Общее устройство транспортных средств категории "В"\nТ1.2 Кузов автомобиля, рабочее место водителя, системы пассивной безопасности',
              { alignment: 'center', text: '2\n\n1\n1' },
              { alignment: 'center', text: '\n\n4' },
            ],
            [
              { alignment: 'center', text: '\n\n\n4' },
              '',
              { alignment: 'center', text: '\n________\n\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nУстройство и техническое обслуживание транспортных средств категории "В" как объектов управления',
              'Т2.2 Обязанности участников дорожного движения\n\nТ1.3 Общее устройство и работа двигателя',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n\n4' },
            ],
            [
              { alignment: 'center', text: '\n5' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nПсихофизиологические основы деятельности водителя',
              'Т2.3 Дорожные знаки\n\nТ3 Основы эффективного общения',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n6' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nОсновы управления транспортными средствами\n\n',
              'Т2.3 Дорожные знаки\n\nТ1 Дорожное движение',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n7' },
              '',
              { alignment: 'center', text: '________\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nОсновы управления транспортными средствами',
              'Т2.3 Дорожные знаки\nТ2.4 Дорожная разметка\nТ2 Профессиональная надежность водителя',
              { alignment: 'center', text: '1\n1\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n8' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nПсихофизиологические основы деятельности водителя',
              'Т2.5 Порядок движения и расположение транспортных средств на  проезжей части\nТ4 Эмоциональные состояние и профилактика конфликтов',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n9' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nОсновы управления транспортными средствами',
              'Т2.5 Порядок движения и расположение транспортных средств на  проезжей части\nТ3 Влияние свойства транспортного средства на эффективность и безопасность управления',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n10' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nУстройство и техническое обслуживание транспортных средств категории "В" как объектов управления',
              'Т2.5 Порядок движения и расположение транспортных средств на  проезжей части\nТ1.4 Общее устройство трансмиссии',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n11' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nОсновы управления транспортными средствами',
              'Т2.6 Остановка и стоянка транспортных средств\n\nТ4 Дорожные условия и безопасность движения',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n12' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nОсновы управления транспортными средствами',
              'Т2.6 Остановка и стоянка транспортных средств\n\nТ4 Дорожные условия и безопасность движения',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n13' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\n Устройство и техническое обслуживание транспортных средств категории "В" как объектов управления',
              'Т2.7 Регулирование дорожного движения\n\nТ1.5 Назначение и состав ходовой части',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n14' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nОсновы управления транспортными средствами',
              'Т2.8 Проезд перекрестков\n\nТ5 Принципы эффективного и безопасного управления транспортным средством',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n15' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\n Устройство и техническое обслуживание транспортных средств категории "В" как объектов управления',
              'Т2.8 Проезд перекрестков\n\nТ1.6 Общее устройство и принцип работы тормозных систем',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n16' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nОсновы управления транспортными средствами',
              'Т2.8 Проезд перекрестков\n\nТ6 Обеспечение безопасности наиболее уязвимых участников дорожного движения',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n17' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nПсихофизиологические основы деятельности водителя',
              {
                text: [
                  'Т2.9 Проезд пешеходных переходов, мест остановок маршрутных транспортных средств и железнодорожных переездов\n',
                  { text: 'Контрольная работа', bold: true },
                ],
              },
              { alignment: 'center', text: '2\n\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n18' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\n\nУстройство и техническое обслуживание транспортных средств категории "В" как объектов управления',
              'Т2.9 Проезд пешеходных переходов, мест остановок маршрутных транспортных средств и железнодорожных переездов\nТ1.7 Общее устройство и принцип работы системы рулевого управления',
              { alignment: 'center', text: '2\n\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n19' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\n\nПсихофизиологические основы деятельности водителя',
              {
                text: [
                  'Т2.9 Проезд пешеходных переходов, мест остановок маршрутных транспортных средств и железнодорожных переездов\nПсихологический практикум "Саморегуляция и профилактика конфликтов ',
                  { text: 'Контрольная работа', bold: true },
                ],
              },
              { alignment: 'center', text: '2\n\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n20' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nУстройство и техническое обслуживание транспортных средств категории "В" как объектов управления',
              'Т2.10 Порядок использования внешних световых приборов и звуковых сигналов\nТ1.8 Электронные системы помощи водителю',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n21' },
              '',
              { alignment: 'center', text: '________\n\n________\n\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\n\nУстройство и техническое обслуживание транспортных средств категории "В" как объектов управления',
              'Т2.11 Буксировка транспортных средств, перевозка людей и грузов.\nТ2.12 Требования к оборудованию и техническому состоянию транспортных средств\nТ1.9 Источники и потребители электрической энергии\nТ1.10 Общее устройство прицепов и тягово-сцепных устройств',
              { alignment: 'center', text: '1\n\n1\n\n1\n1' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n22' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Первая помощь при дорожно-транспортном происшествии\nОсновы управления транспортными средствами категории "В"',
              'Т1 Организационно-правовые аспекты оказания первой помощи\nТ1 Приемы управления транспортным средством',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n23' },
              '',
              { alignment: 'center', text: '\n________\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Первая помощь при дорожно-транспортном происшествии\nУстройство и техническое обслуживание транспорт ных средств категории "В" как объектов управления',
              'Т2 Оказание первой помощи при отсутствии сознания, остановки дыхания и кровообращения\nТ2.1 Система технического обслуживания\nТ2.2 Меры безопасности и защиты окружающей природной среды при эксплуатации транспортных средств',
              { alignment: 'center', text: '2\n\n1\n1' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n24' },
              '',
              { alignment: 'center', text: '________\n\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Основы законодательства РФ в сфере дорожного движения\nОсновы управления транспортными средствами\nПервая помощь при дорожно-транспортном происшествии',
              {
                text: [
                  { text: 'Зачет', bold: true },
                  '\n\n',
                  { text: 'Зачет', bold: true },
                  '\n\n',
                  'Т2 Оказание первой помощи при отсутствии сознания, остановки дыхания и кровообращения',
                ],
              },
              { alignment: 'center', text: '1\n\n1\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n25' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Устройство и техническое обслуживание транспортных средств категории "В" как объектов управления\nОсновы управления транспортными средствами категории "В"',
              {
                text: [
                  'Т2.3 Устранение неисправностей\n',
                  { text: 'Практическое контрольное занятие\n\n', bold: true },
                  'Т2 Управление транспортным средством в штатных ситуациях',
                ],
              },
              { alignment: 'center', text: '2\n\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n26' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Первая помощь при дорожно-транспортном происшествии\nОсновы управления транспортными средствами категории "В"',
              'Т3 Оказание первой помощи при наружных кровотечениях и травмах\nТ2 Управление транспортным средством в штатных ситуациях',
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n27' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Первая помощь при дорожно-транспортном происшествии\nОсновы управления транспортными средствами категории "В"',
              {
                text: [
                  'Т3 Оказание первой помощи при наружных кровотечениях и травмах\n',
                  'Т2 Управление транспортным средством в штатных ситуациях. ',
                  { text: 'Контрольная работа №1', bold: true },
                ],
              },
              { alignment: 'center', text: '2\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n28' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Первая помощь при дорожно-транспортном происшествии\n\nОсновы управления транспортными средствами категории "В"',
              'Т4 Оказание первой помощи при прочих состояниях, транспортировка пострадавших в дорожно-транспортных происшествии\nТ3 Управление транспортным средством в нештатных ситуациях',
              { alignment: 'center', text: '2\n\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n29' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Первая помощь при дорожно-транспортном происшествии\n\nОрганизация и выполнение грузовых перевозок автомобильным транспортом',
              'Т4 Оказание первой помощи при прочих состояниях, транспортировка пострадавших в дорожно-транспортных происшествии\nТ1 Нормативные правовые акты, определяющие порядок перевозки грузов автомобильным транспортом',
              { alignment: 'center', text: '2\n\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n30' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Первая помощь при дорожно-транспортном происшествии\n\nОрганизация и выполнение грузовых перевозок автомобильным транспортом',
              {
                text: [
                  'Т4 Оказание первой помощи при прочих состояниях, транспортировка пострадавших в дорожно-транспортных происшествиях. ',
                  { text: 'Контрольная работа\n', bold: true },
                  'Т1 Нормативные правовые акты, определяющие порядок перевозки грузов автомобильным транспортом',
                ],
              },
              { alignment: 'center', text: '2\n\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n31' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Первая помощь при дорожно-транспортном происшествии\nОрганизация и выполнение грузовых перевозок автомобильным транспортом\n\n',
              {
                text: [
                  'Т3 Управление транспортным средством в нештатных ситуациях ',
                  { text: 'Контрольная работа №2\n', bold: true },
                  'Т2 Основные показатели работы грузовых автомобилей\nТ3 Организация грузовых перевозок',
                ],
              },
              { alignment: 'center', text: '1\n\n1\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n32' },
              '',
              { alignment: 'center', text: '________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Организация и выполнение грузовых перевозок авто мобильным транспортом',
              'Т3 Организация грузовых перевозок\nТ4 Диспетчерское руководство работой подвижного состава',
              { alignment: 'center', text: '2\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n33' },
              '',
              { alignment: 'center', text: '________\n\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Организация и выполнение грузовых перевозок авто мобильным транспортом',
              'Т2 Технико-эксплуатационные показатели пассажирского автотранспорта\nТ3 Диспетчерское руководство работой подвижного состава\nТ4 Работа такси на линии',
              { alignment: 'center', text: '1\n\n1\n\n2' },
              { alignment: 'center', text: '\n4' },
            ],
            [
              { alignment: 'center', text: '\n34' },
              '',
              { alignment: 'center', text: '\n________\n\n________' },
              { alignment: 'center', text: `\n${fullNameTeacher}` },
              'Организация и выполнение грузовых перевозок автомобильным транспортом\nОрганизация и выполнение пассажирских перевозок автомобильным транспортом',
              'Зачет\n\nЗачет',
              { alignment: 'center', text: '1\n\n1' },
              { alignment: 'center', text: '\n2' },
            ],
            [
              '',
              '',
              '',
              { alignment: 'center', text: `${fullNameTeacher}` },
              { alignment: 'center', fontSize: 14, colSpan: 2, text: 'Квалификационный Экзамен' },
              {},
              { alignment: 'center', text: '4' },
              { alignment: 'center', text: '4' },
            ],
          ],
        },
      },
    ],
    styles: {
      pageHeader: { fontSize: 10, bold: true },
      header: { fontSize: 12, bold: true },
      subHeader: { fontSize: 10 },
      tableHeader: { fontSize: 8, alignment: 'center' },
    },
  };
}
