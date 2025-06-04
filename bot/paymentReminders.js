import { PrismaClient } from '@prisma/client';
import { InlineKeyboard } from 'grammy';
import { sendTelegramMessage } from '../lib/telegramBot.js';

const prisma = new PrismaClient();
const dateFirstReminder = 10;
const dateSecondReminder = 25;

function getReminderNumber(startDate, today) {
  const checkpoints = [];

  const first = new Date(startDate);
  if (first.getDate() > dateFirstReminder) first.setMonth(first.getMonth() + 1);
  first.setDate(dateFirstReminder);

  while (checkpoints.length < 12) {
    const d1 = new Date(first);
    const d2 = new Date(first);
    d2.setDate(dateSecondReminder);
    checkpoints.push(new Date(d1), new Date(d2));
    first.setMonth(first.getMonth() + 1);
  }

  checkpoints.sort((a, b) => a.getTime() - b.getTime());
  const passed = checkpoints.filter((date) => date <= today);
  return passed.length;
}

function getRequiredPayment(reminderNumber) {
  if (reminderNumber === 1) return 17500;
  if (reminderNumber === 2) return 25000;
  return 25000 + (reminderNumber - 2) * 7500;
}

async function main() {
  const today = new Date();
  const day = today.getDate();
  if (![dateFirstReminder, dateSecondReminder].includes(day)) return;

  const students = await prisma.student.findMany({
    where: {
      telegramId: { not: null },
      group: {
        isActive: true,
      },
    },
    include: {
      payments: true,
      group: true,
    },
  });

  for (const student of students) {
    const reminderNumber = getReminderNumber(student.group.startTrainingDate, today);
    if (reminderNumber < 1) continue;

    const paid = student.payments.reduce(
      (acc, payment) => acc + parseFloat(payment.amount.toString()),
      0,
    );
    const required = getRequiredPayment(reminderNumber);
    const totalCost = parseFloat(student.trainingCost.toString());

    if (paid < required && required <= totalCost) {
      const remaining = required - paid;
      const totalDebt = totalCost - paid;

      const formattedRemaining = remaining.toLocaleString('ru-RU');
      const formattedDebt = totalDebt.toLocaleString('ru-RU');

      const paymentLine =
        remaining >= 7500
          ? `осталось оплатить <b>${formattedRemaining} ₽</b>`
          : `оплатите минимум <b>${formattedRemaining} ₽</b>`;

      const message = `💰 <b>Напоминание #${reminderNumber}</b>\n${paymentLine} по обучению.\n<b>Общий долг: ${formattedDebt} ₽</b>\n\nПосле оплаты нажмите кнопку <b>Оплатил</b> ниже. Спасибо!`;

      await sendTelegramMessage(student.telegramId, message, {
        parse_mode: 'HTML',
        reply_markup: new InlineKeyboard().text('✅ Оплатил', `payment_done_${student.id}`),
      });
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
