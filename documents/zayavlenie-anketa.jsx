'use client';

import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

/**
 * Кастомный хук для загрузки pdfMake
 */
const usePdfMake = () => {
  const [pdfMake, setPdfMake] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {
        try {
          const pdfMakeModule = await import('pdfmake/build/pdfmake');
          const pdfFontsModule = await import('pdfmake/build/vfs_fonts');

          pdfMakeModule.default.vfs = pdfFontsModule.default.vfs;
          setPdfMake(pdfMakeModule.default);
        } catch (error) {
          console.error('Ошибка загрузки pdfMake:', error);
        }
      })();
    }
  }, []);

  return pdfMake;
};

/**
 * Функция для генерации PDF-документа
 */
const generateDocDefinition = (student) => {
  if (!student || !student.lastName || !student.firstName || !student.birthDate) {
    console.error('Ошибка: данные о студенте отсутствуют');
    return null;
  }

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
              { text: student.birthPlace || '', margin: [0, 2, 0, 2] },
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
                text: `серия: ${student.documentSeries || ' '}  номер: ${student.documentNumber || ' '}  выдан: ${student.documentIssuer || ' '}`,
                margin: [0, 2, 0, 2],
              },
            ],
            [
              { text: '5. Адрес', bold: true, margin: [0, 2, 0, 2] },
              { text: student.registrationAddress || '', margin: [0, 2, 0, 2] },
            ],
            [
              { text: '6. Телефон', bold: true, margin: [0, 2, 0, 2] },
              { text: student.phone || ' ', margin: [0, 2, 0, 2] },
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
    ],
    styles: {
      header: { fontSize: 20, bold: true },
      subheader: { fontSize: 16, margin: [0, 5, 0, 5] },
    },
  };
};

/**
 * Компонент кнопки для генерации заявления-анкеты
 */
export default function ZayavlenieAnketaButton({ student }) {
  const pdfMake = usePdfMake();

  const generatePDF = useCallback(() => {
    if (!pdfMake) {
      console.error('pdfMake не загружен');
      return;
    }

    const docDefinition = generateDocDefinition(student);
    if (!docDefinition) return;

    pdfMake.createPdf(docDefinition).open();
  }, [pdfMake, student]);

  return (
    <button onClick={generatePDF} disabled={!pdfMake || !student}>
      Заявление-анкета
    </button>
  );
}
