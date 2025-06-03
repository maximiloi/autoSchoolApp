import { PrismaClient } from '@prisma/client';
import { InlineKeyboard } from 'grammy';
import { sendTelegramMessage } from '../lib/telegramBot.js';

const prisma = new PrismaClient();

async function main() {
  const today = new Date();
  const day = today.getDate();
  if (![3, 24].includes(day)) return;

  const students = await prisma.student.findMany({
    where: {
      telegramId: { not: null },
      group: {
        isActive: true,
      },
    },
    include: {
      payments: true,
    },
  });

  for (const student of students) {
    const paid = student.payments.reduce(
      (acc, payment) => acc + parseFloat(payment.amount.toString()),
      0,
    );
    const total = parseFloat(student.trainingCost.toString());

    if (paid < total) {
      const remaining = total - paid;
      await sendTelegramMessage(
        student.telegramId,
        `💰 Пожалуйста, оплатите обучение: осталось оплатить ${remaining} ₽.\nНажмите "Оплатил" после перевода.`,
        {
          reply_markup: new InlineKeyboard().text('✅ Оплатил', `payment_done_${student.id}`),
        },
      );
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
