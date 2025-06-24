import { PrismaClient } from '@prisma/client';
import { Bot, InlineKeyboard } from 'grammy';
import { sendTelegramMessage } from './sendTelegramMessage.js';

const prisma = new PrismaClient();
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const dateFirstReminder = 10;
const dateSecondReminder = 25;

const adminChatIds =
  process.env.TELEGRAM_ADMIN_CHAT_ID?.split(',')
    .map((id) => id.trim())
    .filter(Boolean) || [];

function getReminderNumber(startDate, today) {
  const start = new Date(startDate);
  const fiveDaysAfterStart = new Date(start);
  fiveDaysAfterStart.setDate(start.getDate() + 5);

  if (today < fiveDaysAfterStart) return 0;

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
  const passed = checkpoints.filter((date) => date <= today && date >= fiveDaysAfterStart);
  return passed.length;
}

function getRequiredPayment(reminderNumber) {
  if (reminderNumber === 1) return 17500;
  if (reminderNumber === 2) return 25000;
  return 25000 + (reminderNumber - 2) * 7500;
}

async function main() {
  for (const adminId of adminChatIds) {
    try {
      await bot.api.sendMessage(adminId, '⚙️ Скрипт напоминания о оплате запущен');
    } catch (err) {
      console.error(`Ошибка при уведомлении админа ${adminId} о запуске скрипта:`, err);
    }
  }

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

  const reportLines = [];

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
          ? `минимальная сумма к оплате <b>${formattedRemaining} ₽</b>`
          : `оплатите минимум <b>${formattedRemaining} ₽</b>`;

      const message = `💰 <b>Напоминание #${reminderNumber}</b>\n${paymentLine} по обучению.\n\nОплатить можно:\n📞 СБП по номеру: +7 921 690-19-75\n💳 на карту Сбербанка: 2202 2083 2509 3095\n👤 Получатель: Игорь Евгеньевич Т.\n\n<b>Общий долг: ${formattedDebt} ₽</b>\n\n❗️ В комментарии к переводу укажите номер <b>Вашего</b> договора.\n\nПосле оплаты нажмите кнопку <b>Оплатил</b> ниже. Спасибо!`;

      await sendTelegramMessage(student.telegramId, message, {
        parse_mode: 'HTML',
        reply_markup: new InlineKeyboard().text('✅ Оплатил', `payment_done_${student.id}`),
      });

      const fullName =
        `${student.lastName} ${student.firstName} ${student.middleName ?? ''}`.trim();
      const groupNumber = student.group?.groupNumber || '—';
      reportLines.push(`• ${fullName} — #${groupNumber} — Напоминание #${reminderNumber}`);
    }
  }

  if (reportLines.length > 0) {
    const reportMessage = `📤 Отправлены напоминания об оплате:\n\n${reportLines.join('\n\n')}`;
    for (const adminId of adminChatIds) {
      try {
        await bot.api.sendMessage(adminId, reportMessage);
      } catch (error) {
        console.error(`Ошибка при отправке отчета админу ${adminId}:`, error);
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
