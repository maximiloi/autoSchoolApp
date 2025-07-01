'use server';

import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';
import { auth } from '../auth';

const prisma = new PrismaClient();

export async function exportDpoStudentsToBuffer(companyId, year) {
  const session = await auth();
  if (!session) throw new Error('User is not authenticated');

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const students = await prisma.student.findMany({
    where: {
      companyId: companyId,
      group: {
        startTrainingDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    },
    include: {
      group: true,
    },
  });

  const templatePath = path.join(process.cwd(), 'public', 'shablon_dpo.xlsx');
  const buffer = await fs.readFile(templatePath);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const sheet = workbook.getWorksheet('Шаблон');

  students.forEach((student, index) => {
    const row = sheet.getRow(index + 2);

    row.getCell(1).value = 'Свидетельство о профессии рабочего, должности служащего';
    row.getCell(2).value = 'Оригинал';
    row.getCell(3).value = 'Нет';
    row.getCell(4).value = 'Нет';
    row.getCell(5).value = 'Нет';
    row.getCell(7).value = student.certificateNumber?.toString() || '';
    row.getCell(8).value = student.certificateIssueDate?.toLocaleDateString('ru-RU') || '';
    row.getCell(10).value =
      'Программа профессиональной подготовки по профессии рабочего, должности служащего';
    row.getCell(11).value =
      'Программа профессиональной подготовки водителей транспортных средств категории B';
    row.getCell(12).value = 'Водитель автомобиля';
    row.getCell(19).value = student.group?.startTrainingDate?.toLocaleDateString('ru-RU') || '';
    row.getCell(20).value = student.group?.endTrainingDate?.toLocaleDateString('ru-RU') || '';
    row.getCell(21).value = 190;
    row.getCell(22).value = student.lastName;
    row.getCell(23).value = student.firstName;
    row.getCell(24).value = student.middleName || 'нет';
    row.getCell(25).value = student.birthDate?.toLocaleDateString('ru-RU') || '';
    row.getCell(26).value = student.gender === 'male' ? 'Муж' : 'Жен';
    row.getCell(27).value = student.snils || '';

    row.commit();
  });

  return await workbook.xlsx.writeBuffer();
}
