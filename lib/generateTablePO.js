import { utils, writeFile } from 'xlsx';

export function generateTablePO(students, selectYear, isFirstHalf = false) {
  const wb = utils.book_new();
  const ws = utils.aoa_to_sheet([]);

  const ageRefDate = new Date(`${selectYear}-01-01`);

  // Подсчет данных по возрасту и полу
  const ageGroups = {
    '14 лет': { total: 0, female: 0 },
    '15 лет': { total: 0, female: 0 },
    '16 лет': { total: 0, female: 0 },
    '17 лет': { total: 0, female: 0 },
    '18 лет': { total: 0, female: 0 },
    '19 лет': { total: 0, female: 0 },
    '20 лет': { total: 0, female: 0 },
    '21 год': { total: 0, female: 0 },
    '22 года': { total: 0, female: 0 },
    '23 года': { total: 0, female: 0 },
    '24 года': { total: 0, female: 0 },
    '25 лет': { total: 0, female: 0 },
    '26 лет': { total: 0, female: 0 },
    '27 лет': { total: 0, female: 0 },
    '28 лет': { total: 0, female: 0 },
    '29 лет': { total: 0, female: 0 },
    '30-34 лет': { total: 0, female: 0 },
    '35-39 лет': { total: 0, female: 0 },
    '40-44 лет': { total: 0, female: 0 },
    '45-49 лет': { total: 0, female: 0 },
    '50-54 лет': { total: 0, female: 0 },
    '55-59 лет': { total: 0, female: 0 },
    '60 лет и старше': { total: 0, female: 0 },
    'В возрасте моложе 14 лет': { total: 0, female: 0 },
  };

  students.forEach((student) => {
    const birthDate = new Date(student.birthDate);
    const age =
      ageRefDate.getFullYear() -
      birthDate.getFullYear() -
      (ageRefDate.getMonth() < birthDate.getMonth() ||
      (ageRefDate.getMonth() === birthDate.getMonth() && ageRefDate.getDate() < birthDate.getDate())
        ? 1
        : 0);
    const gender = student.gender === 'female' ? 1 : 0;

    if (age < 14) {
      ageGroups['В возрасте моложе 14 лет'].total++;
      if (gender) ageGroups['В возрасте моложе 14 лет'].female++;
    } else if (age === 14) {
      ageGroups['14 лет'].total++;
      if (gender) ageGroups['14 лет'].female++;
    } else if (age === 15) {
      ageGroups['15 лет'].total++;
      if (gender) ageGroups['15 лет'].female++;
    } else if (age === 16) {
      ageGroups['16 лет'].total++;
      if (gender) ageGroups['16 лет'].female++;
    } else if (age === 17) {
      ageGroups['17 лет'].total++;
      if (gender) ageGroups['17 лет'].female++;
    } else if (age === 18) {
      ageGroups['18 лет'].total++;
      if (gender) ageGroups['18 лет'].female++;
    } else if (age === 19) {
      ageGroups['19 лет'].total++;
      if (gender) ageGroups['19 лет'].female++;
    } else if (age === 20) {
      ageGroups['20 лет'].total++;
      if (gender) ageGroups['20 лет'].female++;
    } else if (age === 21) {
      ageGroups['21 год'].total++;
      if (gender) ageGroups['21 год'].female++;
    } else if (age === 22) {
      ageGroups['22 года'].total++;
      if (gender) ageGroups['22 года'].female++;
    } else if (age === 23) {
      ageGroups['23 года'].total++;
      if (gender) ageGroups['23 года'].female++;
    } else if (age === 24) {
      ageGroups['24 года'].total++;
      if (gender) ageGroups['24 года'].female++;
    } else if (age === 25) {
      ageGroups['25 лет'].total++;
      if (gender) ageGroups['25 лет'].female++;
    } else if (age === 26) {
      ageGroups['26 лет'].total++;
      if (gender) ageGroups['26 лет'].female++;
    } else if (age === 27) {
      ageGroups['27 лет'].total++;
      if (gender) ageGroups['27 лет'].female++;
    } else if (age === 28) {
      ageGroups['28 лет'].total++;
      if (gender) ageGroups['28 лет'].female++;
    } else if (age === 29) {
      ageGroups['29 лет'].total++;
      if (gender) ageGroups['29 лет'].female++;
    } else if (age >= 30 && age <= 34) {
      ageGroups['30-34 лет'].total++;
      if (gender) ageGroups['30-34 лет'].female++;
    } else if (age >= 35 && age <= 39) {
      ageGroups['35-39 лет'].total++;
      if (gender) ageGroups['35-39 лет'].female++;
    } else if (age >= 40 && age <= 44) {
      ageGroups['40-44 лет'].total++;
      if (gender) ageGroups['40-44 лет'].female++;
    } else if (age >= 45 && age <= 49) {
      ageGroups['45-49 лет'].total++;
      if (gender) ageGroups['45-49 лет'].female++;
    } else if (age >= 50 && age <= 54) {
      ageGroups['50-54 лет'].total++;
      if (gender) ageGroups['50-54 лет'].female++;
    } else if (age >= 55 && age <= 59) {
      ageGroups['55-59 лет'].total++;
      if (gender) ageGroups['55-59 лет'].female++;
    } else if (age >= 60) {
      ageGroups['60 лет и старше'].total++;
      if (gender) ageGroups['60 лет и старше'].female++;
    }
  });

  // Стиль для центрирования и переноса текста
  const cellStyle = {
    alignment: {
      horizontal: 'center',
      vertical: 'center',
      wrapText: true,
    },
  };

  // Обновление заголовков с объединением ячеек
  const headerData = [
    [
      'Наименование показателей',
      '№ строки',
      'Программы профессиональной подготовки по профессиям рабочих, должностям служащих',
      '',
      'Программы переподготовки рабочих, служащих',
      '',
      'Программы повышения квалификации рабочих, служащих',
      '',
    ],
    [
      '',
      '',
      'всего обучено',
      'из них женщины',
      'всего обучено',
      'из них женщины',
      'всего обучено',
      'из них женщины',
    ],
  ];

  // Применение стиля к заголовкам
  utils.sheet_add_aoa(ws, headerData, { origin: 'A1' });
  for (let row = 0; row < headerData.length; row++) {
    for (let col = 0; col < headerData[row].length; col++) {
      const cellRef = utils.encode_cell({ r: row, c: col });
      if (headerData[row][col] !== '') {
        ws[cellRef] = { t: 's', v: headerData[row][col], s: cellStyle };
      } else {
        ws[cellRef] = { t: 's', v: '', s: cellStyle }; // Применяем стиль к пустым ячейкам
      }
    }
  }

  // Объединение ячеек для повторяющегося текста
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // A1:A2
    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // B1:B2
    { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } }, // C1:D1
    { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } }, // E1:F1
    { s: { r: 0, c: 6 }, e: { r: 0, c: 7 } }, // G1:H1
  ];

  // Установка ширины столбцов (в условных единицах Excel)
  ws['!cols'] = [
    { wch: 50 }, // A: Наименование показателей
    { wch: 6 }, // B: № строки
    { wch: 20 }, // C: всего обучено
    { wch: 20 }, // D: из них женщины
    { wch: 20 }, // E: всего обучено
    { wch: 20 }, // F: из них женщины
    { wch: 20 }, // G: всего обучено
    { wch: 20 }, // H: из них женщины
  ];

  // Установка высоты строк (в пунктах, 1 пункт ≈ 1/72 дюйма)
  ws['!rows'] = [
    { hpt: 50 }, // Высота первой строки
    { hpt: 20 }, // Высота второй строки
    { hpt: 20 }, // Высота строки "Всего обучено"
    { hpt: 20 }, // Высота строки "В том числе в возрасте"
  ];

  // Добавление строк "Всего обучено" и "В том числе в возрасте"
  const totalTrained = Object.values(ageGroups).reduce((sum, group) => sum + group.total, 0);
  const totalFemale = Object.values(ageGroups).reduce((sum, group) => sum + group.female, 0);
  const totalRowData = ['Всего обучено (сумма строк 02-26)', '01', totalTrained, totalFemale];
  const ageHeaderRowData = [
    'В том числе в возрасте (число полных лет на 1 января):',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ];

  utils.sheet_add_aoa(ws, [totalRowData], { origin: 'A3' });
  utils.sheet_add_aoa(ws, [ageHeaderRowData], { origin: 'A4' });

  // Применение стиля к строкам "Всего обучено" и "В том числе в возрасте"
  for (let col = 0; col < totalRowData.length; col++) {
    const cellRef1 = utils.encode_cell({ r: 2, c: col });
    const cellRef2 = utils.encode_cell({ r: 3, c: col });
    ws[cellRef1] = { t: 's', v: totalRowData[col], s: cellStyle };
    ws[cellRef2] = { t: 's', v: ageHeaderRowData[col], s: cellStyle };
  }

  // Обновление строк с возрастными группами с применением стиля
  let rowIndex = 5;
  for (let [age, { total, female }] of Object.entries(ageGroups)) {
    const rowData = [age, (rowIndex - 3).toString().padStart(2, '0'), total, female];
    utils.sheet_add_aoa(ws, [rowData], { origin: `A${rowIndex}` });
    for (let col = 0; col < rowData.length; col++) {
      const cellRef = utils.encode_cell({ r: rowIndex - 1, c: col });
      ws[cellRef] = {
        t: rowData[col] === total || rowData[col] === female ? 'n' : 's',
        v: rowData[col],
        s: cellStyle,
      };
    }
    rowIndex++;
  }

  utils.book_append_sheet(wb, ws, 'Sheet1');
  // Сохранение файла
  writeFile(wb, `shablon_po-${isFirstHalf ? '1st-half-' : 'full-'}${selectYear}.xlsx`);
}
