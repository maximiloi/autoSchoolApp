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
            `👋 Здравствуйте, <b>${student.lastName} ${student.firstName}</b>!\n\n📅 Напоминаем: обучение в группе №<b>${group.groupNumber}</b> начнётся через <b>${daysBefore}</b> дней — <b>${format(group.startTrainingDate, 'dd.MM.yyyy')}</b>.\n\nПожалуйста, будьте готовы к началу курса.`,
            {
              parse_mode: 'HTML',
            },
          );
        }
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
