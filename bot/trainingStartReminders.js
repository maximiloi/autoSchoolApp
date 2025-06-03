import { PrismaClient } from '@prisma/client';
import { addDays, format, isSameDay } from 'date-fns';
import { sendTelegramMessage } from '../lib/telegramBot.js';

const prisma = new PrismaClient();

async function main() {
  const today = new Date();
  const notifyDays = [5, 3]; // За 5 и 3 дня до начала

  const groups = await prisma.group.findMany({
    where: {
      isActive: true,
      startTrainingDate: {
        gte: today,
      },
    },
    include: {
      students: {
        where: {
          telegramId: {
            not: null,
          },
        },
      },
    },
  });

  for (const group of groups) {
    for (const daysBefore of notifyDays) {
      const notifyDate = addDays(today, daysBefore);
      if (isSameDay(group.startTrainingDate, notifyDate)) {
        for (const student of group.students) {
          await sendTelegramMessage(
            student.telegramId,
            `📅 Напоминание: обучение в группе № ${group.groupNumber} начнётся через ${daysBefore} дней — <b>${format(group.startTrainingDate, 'dd.MM.yyyy')}</b>. Пожалуйста, будьте готовы к началу курса!`,
          );
        }
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
