import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { inclineFirstname, inclineLastname, inclineMiddlename } from 'lvovich';

export default function BasicContract(student, group, company) {
  if (!student || !group || !company) {
    console.error('Ошибка: не все данные');
    return null;
  }

  return {
    content: [
      {
        text: `ДОГОВОР № ${group?.groupNumber}${group?.category}-${student?.studentNumber}`,
        style: 'header',
        alignment: 'center',
      },
      {
        columns: [
          {
            text: '',
            width: '5%',
          },
          {
            text: 'на оказание платных образовательных услуг по профессиональной подготовке водителей транспортных средств категории «В»',
            style: 'subheader',
            alignment: 'center',
            width: '90%',
          },
          {
            text: '',
            width: '5%',
          },
        ],
        alignment: 'center',
      },
      {
        columns: [
          { text: `${company?.city}`, style: 'upColontitul', alignment: 'left' },
          {
            text: `${format(new Date(student.createdAt), 'PPP', { locale: ru })}`,
            style: 'upColontitul',
            alignment: 'right',
          },
        ],
      },
      {
        text: `${company?.companyName} на основании лицензии ${company?.license}, выданной ${company?.whoIssuedLicense} от ${student?.whenIssuedLicense || format(new Date(student.birthDate), 'PPP', { locale: ru })} в лице генерального директора ${inclineLastname(company.directorSurname, 'genitive')} ${inclineFirstname(company.directorName, 'genitive')} ${inclineMiddlename(company.directorPatronymic, 'genitive')}, действующе-го на основании Устава, (далее — «Исполнитель»), с одной стороны и ${inclineLastname(student.lastName, 'genitive')} ${inclineFirstname(student.firstName, 'genitive')} ${inclineMiddlename(student.middleName, 'genitive')} (далее — «Заказчик»), с другой стороны, заключили настоящий договор о нижеследующем:`,
      },
      {
        text: '1. Предмет договора',
        style: 'sectionHeader',
      },
      {
        text: [
          '1.1. «Исполнитель» предоставляет, а «Заказчик» оплачивает образовательные услуги по программе профессиональной подготовки водителей транспортных средств категории «В», (далее — «Услуги»).',
          `\n1.2. Данная программа включает 194 учебных часов, из них 56 часов практического вождения транспортного средства, 134 учебных часа теоретических занятий, 4 часа экзаменов. Срок обучения: c ${format(new Date(group.startTrainingDate), 'PPP', { locale: ru })} по ${format(new Date(group.endTrainingDate), 'PPP', { locale: ru })}`,
          '\n1.3. Обучение проводится очно, на русском языке.',
          '\n1.4.  После прохождения Заказчиком полного курса обучения и успешной итоговой аттестации (квалификационного экзамена) ему выдается Свидетельство о профессии водителя.',
          '\n1.5. Обучение проводится при наличии медицинского заключения соответствующей формы об отсутствии у Заказчика медицинских противопоказаний и запрещений к управлению транспортным средством.',
        ],
      },
      {
        text: '2. Обязанности сторон',
        style: 'sectionHeader',
      },
      {
        text: [
          { text: '2.1. ', bold: false },
          { text: 'Исполнитель обязан:', bold: true },
          '\n2.1.1. Организовать и обеспечить надлежащее исполнение услуг, предусмотренных настоящим договором, в соответствии с утвержденной программой и календарным учебным планом.',
          '\nПроводить обучение в дни согласно расписанию занятий на учебную группу, в которую зачисляется Заказчик. Занятия по вождению транспортных средств проводятся по отдельному графику, составленному с учетом пожеланий Заказчика, но не более 2-х часов в день.',
          '\n2.1.2. Обеспечить для проведения занятий оборудованный учебный кабинет, соответствующий санитарным и гигиеническим требованиям, а также оснащение, соответствующее обязательным нормам и правилам, предъявляемым к образовательному процессу (учебно-методические и учебно-наглядные пособия, транспортные средства, педагогический состав и др.). Обеспечить возможность обучения практическому вождению.',
          '\n2.1.3. Организовать проведение промежуточной и итоговой аттестации в соответствии с Положением о структурном подразделении по подготовке водителей автотранспортных средств.',
          '\n2.1.4. Оформить Заказчику Свидетельство о профессии водителя, после окончания Заказчиком полного курса обучения и успешной сдачи итоговой аттестации',
          '\n2.1.5. Проявлять уважение к личности Заказчика, обеспечивать комфортные условия обучения.',
          '\n2.1.6. Сохранить место за Заказчиком в образовательном учреждении, в случае пропуска занятий по уважительным причинам, подтвержденным документально, и при условии своевременной и полной оплаты в порядке, предусмотренном разделом 4 настоящего договора.',
          '\n\n',
          { text: '2.2. ', bold: false },
          { text: 'Заказчик обязан:', bold: true },
          '\n2.2.1. Своевременно вносить плату в порядке, предусмотренном разделом 4 настоящего договора',
          '\n2.2.2. Предоставить Исполнителю медицинскую справку и ее копию, а также 2 личные фотографии, размером 3х4, не позднее дня начала практического обучения вождению.',
          '\n2.2.3. Не позднее 5 календарных дней сообщать Исполнителю об изменении реквизитов документов, удостоверяющих личность Заказчика, смене адреса места жительства (регистрации), контактного телефона, а также состояния здоровья.',
          '\n2.2.4. Соблюдать учебную дисциплину и общепринятые нормы поведения, проявлять уважение к преподавателям, инструкторам по вождению, администрации и техническому персоналу Исполнителя и другим обучающимся.',
          '\n2.2.5. Регулярно посещать занятия согласно утвержденному Исполнителем расписанию занятий группы и графику практического вождения транспортных средств. Пропуск занятий по уважительным причинам (болезнь, командировка и т.п.), должен быть подтвержден документально. В противном случае причина считается неуважительной.',
          '\n2.2.6. Выполнять задания по подготовке к занятиям, выдаваемые преподавателями, контрольные задания, проходить промежуточную и итоговую аттестацию в порядке и сроки, установленные Исполнителем.',
          '\n2.2.7. Придерживаться указаний и рекомендаций преподавателей и инструкторов по вождению во время занятий, соблюдать правила техники безопасности, выполнять требования противопожарных, санитарных и экологических норм. Запрещается посещать занятия в состоянии алкогольного, наркотического и токсикологического опьянения, а также курить в неустановленных местах.',
          '\n2.2.8. Бережно относиться к имуществу Исполнителя и других обучающихся. При преднамеренной порче учебного имущества (в т.ч. учебных транспортных средств) возместить Исполнителю причиненный ущерб.',
        ],
      },
      {
        text: '3. Права сторон',
        style: 'sectionHeader',
      },
      {
        text: [
          { text: '3.1. ', bold: false },
          { text: 'Исполнитель вправе:', bold: true },
          '\n3.1.1. Самостоятельно осуществлять образовательный процесс, выбирать системы оценок знаний, умений и навыков Заказчика, порядок проведения промежуточной и итоговой аттестации, утверждать расписание занятий группы (график занятий), а также вносить в них необходимые изменения.',
          '\n3.1.2. Отчислить Заказчика из учебной группы в следующих случаях:— неоднократного или грубого нарушения дисциплины при проведении занятий;',
          '\n— пропуска занятий по неуважительной причине более 30% учебного времени;',
          '\n— нарушения порядка расчетов и оплаты образовательных услуг, закрепленных договором;',
          '\n— выявление обстоятельств, наличие которых препятствует условиям приема на обучение;',
          '\n— получения неудовлетворительной оценки при сдаче квалификационного экзамена со второго раза.',
          '\n\n',
          { text: '3.2. ', bold: false },
          { text: 'Заказчик вправе:', bold: true },
          '\n3.2.1. Требовать от Исполнителя обеспечения учебного процесса в оборудованном учебном классе и на учебных автомобилях, соответствующих требованиям учебной программы профессиональной подготовке водителей транспортных средств категории «В».',
          '\n3.2.2. Обращаться непосредственно к руководству учреждения с предложениями и пожеланиями по вопросам образовательного процесса и качества обучения.',
          '\n3.2.3. Получать полную и достоверную информацию об оценке своих знаний, умений и навыков, а также о критериях этой оценки',
          '\n3.2.4. Пользоваться во время занятий учебной литературой, учебно-материальной базой Исполнителя, необходимой для осуществления образовательного процесса.',
          '\n3.2.5. Обжаловать приказы администрации, затрагивающие его личные права и интересы, в установленном законодательством Российской Федерации порядке.',
          '\n3.2.6. Отказаться от исполнения настоящего договора в порядке, предусмотренном настоящим договором и действующим законодательством.',
        ],
      },

      {
        text: '4. Оплата услуг и порядок расчетов',
        style: 'sectionHeader',
      },
      {
        text: [
          `4.1. Стоимость образовательных услуг, указанных в разделе 1 настоящего договора,составляет ${student.trainingCost} рублей.`,
          '\n4.2. Заказчик может оплатить услуги единовременно, в день заключения настоящего договора, либо в рассрочку в следующем порядке:',
          `\n- В первую неделю обучения: ${student.trainingCost / 3} рублей.'`,
          `\n- Во второй месяц обучения: ${student.trainingCost / 3} рублей.`,
          `\n- В третий месяц обучения: ${student.trainingCost / 3} рублей.`,
          '\n4.3. Оплата по настоящему договору осуществляется Заказчиком путем внесения наличных денежных средств в кассу Исполнителя по месту его нахождения или на расчетный счет Исполнителя.',
        ],
      },

      {
        text: '5. Порядок изменения и расторжения договора',
        style: 'sectionHeader',
      },
      {
        text: [
          '5.1. Настоящий договор вступает в силу с момента его подписания Сторонами.',
          '\n5.2. Обязательства Исполнителя по обучению прекращаются после получения Заказчиком Свидетельства о профессии водителя.',
          '\n5.3. Исполнитель вправе в одностороннем порядке отказаться от исполнения настоящего договора в случаях, указанных в п. 3.1.2. При этом настоящий договор считается расторгнутым с даты, указанной Исполнителем в приказе об изменении численности учебной группы, в приказе указывается причина отчисления. Данный приказ доводится Заказчику под роспись, либо почтовым отправлением по месту его пребывания, при этом Заказчик обязан оплатить Исполнителю стоимость фактически оказанных услуг и понесенных расходов. Излишне внесенные Заказчиком денежные средства подлежат возврату наличным или безналичным путем по желанию Заказчика.',
          '\n5.4. При получении неудовлетворительной оценки на итоговой аттестации двух и более раз, на основании письменного заявления Заказчика и с согласия Исполнителя, Заказчик может быть направлен на повторное обучение, либо ему могут быть предоставлены дополнительные занятия для подготовки к сдаче итоговой аттестации за дополнительную плату в соответствии с тарифами, установленными Исполнителем. Обучение Заказчика в объеме, превышающем учебный план по программе подготовки водителей, повторное обучение, производится за дополнительную плату в соответствии с тарифами, установленными Исполнителем.',
          '\n5.5. Заказчик вправе в любое время отказаться от исполнения настоящего договора при условии оплаты Исполнителю фактически понесенных им расходов.',
        ],
      },

      {
        text: '6. Заключительные положения',
        style: 'sectionHeader',
      },
      {
        text: [
          '6.1. Настоящий Договор составлен в двух экземплярах, имеющих равную юридическую силу, по одному каждой из Сторон.',
          '\n6.2. Все разногласия по настоящему договору Стороны обязуются решать путем переговоров, а при невозможности их урегулирования — в судебном порядке в соответствии с действующим законодательством.',
        ],
      },
      {
        text: '7. Реквизиты и подписи сторон',
        style: 'sectionHeader',
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', '*'], // Распределяет ширину равномерно по всей странице
          body: [
            [
              { text: 'Исполнитель:', style: 'tableHeader', alignment: 'center' },
              { text: 'Заказчик:', style: 'tableHeader', alignment: 'center' },
            ],
            [
              `${company.companyName}\nИНН/КПП: ${company.inn}/${company.kpp}\nЮридический адрес: ${company.legalAddress}\n\nБанковские реквизиты:\nр/с ${company.account}\nв ${company.bank} ${company.city}\nБИК: ${company.bik}\nк/c ${company.correspondentAccount}\n\nТелефон: ${company.phone}\ne-mail: ${company.email}\n\n\n\n____________________/${company.directorSurname} ${company.directorName[0]}. ${company.directorPatronymic ? company.directorPatronymic[0] + '.' : ''}/\n\n\n\n\n\n`,
              `Фамилия: ${student.lastName}\nИмя: ${student.firstName}\nОтчество: ${student.middleName}\n\nДата рождения: ${format(new Date(student.birthDate), 'PPP', { locale: ru })}\nАдрес проживания: ${student.actualAddress}\nТелефон: ${student.phone}\n\nПаспорт: серия ${student.documentSeries} номер ${student.documentNumber} выдан ${student.documentIssuer}\n\n\n\n____________________/${student.lastName} ${student.firstName[0]}. ${student.middleName ? student.middleName[0] + '.' : ''}/\n\n\n\n\n\n`,
            ],
          ],
        },
      },
      {
        text: '\n\nЯ даю согласие, в соответствии с требованиями Федерального закона от 27.07.2006 года № 152 «О персональных данных» и постановления Правительства РФ от 15.09.2008 № 687 «Об утверждении положения об особенностях обработки персональных данных, осуществляемой без использования средств автоматизации», на обработку указанных моих персональных данных без использования средств автоматизации включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, удаление и уничтожение, исключительно в целях предоставления платных образовательных услуг на период от даты подписания данного Договора до окончания срока действия Договора.',
        style: 'upColontitul',
      },
      {
        text: `"______"   ______________________    ______          _________________________/${student.lastName} ${student.firstName[0]}. ${student.middleName ? student.middleName[0] + '.' : ''}/`,
        style: 'upColontitul',
      },
    ],

    styles: {
      header: { fontSize: 18, bold: true },
      subheader: { fontSize: 14, italics: true, margin: [0, 5, 0, 5] },
      upColontitul: { fontSize: 12, italics: true, margin: [0, 5, 0, 5] },
      sectionHeader: { fontSize: 14, bold: true, margin: [0, 15, 0, 10] },
      tableHeader: { fontSize: 13, bold: true },
    },
  };
}
