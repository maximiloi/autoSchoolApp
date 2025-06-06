import { PrismaClient } from '@prisma/client';
import { addDays, format } from 'date-fns';
import { sendTelegramMessage } from '../lib/telegramBot.js';

const prisma = new PrismaClient();

async function main() {
  const tomorrow = addDays(new Date(), 1);
  const start = new Date(tomorrow.setHours(0, 0, 0, 0));
  const end = new Date(tomorrow.setHours(23, 59, 59, 999));

  const sessions = await prisma.drivingSession.findMany({
    where: {
      date: {
        gte: start,
        lte: end,
      },
      student: {
        telegramId: { not: null },
      },
    },
    include: {
      student: true,
    },
  });

  for (const session of sessions) {
    const student = session.student;
    const time = session.slot ? `в ${session.slot}` : '';
    await sendTelegramMessage(
      student.telegramId,
      `🚗 Напоминание: у вас завтра вождение ${time} (${format(session.date, 'dd.MM.yyyy')})`,
    );
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
