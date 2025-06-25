import { PrismaClient } from '@prisma/client';
import { Bot, InlineKeyboard } from 'grammy';
import { sendTelegramMessage } from './sendTelegramMessage.js';

const prisma = new PrismaClient();
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const dateFirstReminder = 8;
const dateSecondReminder = 23;

const adminChatIds =
  process.env.TELEGRAM_ADMIN_CHAT_ID?.split(',')
    .map((id) => id.trim())
    .filter(Boolean) || [];

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
    const paid = student.payments.reduce(
      (acc, payment) => acc + parseFloat(payment.amount.toString()),
      0,
    );
    const totalCost = parseFloat(student.trainingCost.toString());
    const totalDebt = totalCost - paid;

    if (totalDebt <= 0) continue;

    const remaining = totalDebt < 7500 ? totalDebt : 7500;
    const formattedRemaining = remaining.toLocaleString('ru-RU');
    const formattedDebt = totalDebt.toLocaleString('ru-RU');

    const paymentLine =
      remaining >= 7500
        ? `минимальная сумма к оплате <b>${formattedRemaining} ₽</b>`
        : `оплатите <b>${formattedRemaining} ₽</b>`;

    const message = `💰 <b>Напоминание об оплате</b>\n${paymentLine} по обучению.\n\nОплатить можно:\n📞 СБП по номеру: +7 921 690-19-75\n💳 на карту Сбербанка: 2202 2083 2509 3095\n👤 Получатель: Игорь Евгеньевич Т.\n\n<b>Общий долг: ${formattedDebt} ₽</b>\n\n❗️ В комментарии к переводу укажите номер <b>Вашего</b> договора.\n\nПосле оплаты нажмите кнопку <b>Оплатил</b> ниже. Спасибо!`;

    await sendTelegramMessage(student.telegramId, message, {
      parse_mode: 'HTML',
      reply_markup: new InlineKeyboard().text('✅ Оплатил', `payment_done_${student.id}`),
    });

    const fullName = `${student.lastName} ${student.firstName} ${student.middleName ?? ''}`.trim();
    const groupNumber = student.group?.groupNumber || '—';
    reportLines.push(`• ${fullName} — #${groupNumber} — Долг: ${formattedDebt} ₽`);
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
