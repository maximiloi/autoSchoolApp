import { PrismaClient } from '@prisma/client';
import { Bot, InlineKeyboard } from 'grammy';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const prisma = new PrismaClient();

// /start с параметром ?start=studentId
bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const studentId = ctx.match;

  if (!studentId) {
    await ctx.reply(
      '❗️Ошибка: отсутствует код. Пожалуйста, используйте QR-код из Заявления-анкеты.',
    );
    return;
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { group: true },
    });

    if (!student) {
      await ctx.reply('😕 Код недействителен. Обратитесь в автошколу.');
      return;
    }

    // Обновляем Telegram ID студента
    await prisma.student.update({
      where: { id: student.id },
      data: { telegramId: chatId },
    });

    const message = `
    👋 Здравствуйте, <b>${student.lastName} ${student.firstName}</b>!
    
    ✅ Вы успешно <b>подписались на уведомления</b>.
    
    ℹ️ Вы проходите обучение в группе № <b>${student.group.groupNumber}</b>, начало занятий — <b>${student.group.startTrainingDate.toLocaleDateString('ru-RU')} г</b>.
    💳 Стоимость курса составляет <b>${student.trainingCost.toFixed(2)} ₽</b>.
    
    📬 Теперь вы будете получать:
    • 🚗 Уведомления о запланированных занятиях по вождению  
    • 💰 Напоминания об оплате — <b>10</b> и <b>25</b> числа каждого месяца
    
    ❗ Напоминания об оплате будут приходить <b>до полной оплаты курса или окончания обучения</b>.
    `;

    const keyboard = new InlineKeyboard()
      .text('💳 Узнать долг за обучение', 'check_debt')
      .row()
      .text('🚘 Мои занятия по вождению', 'view_sessions');

    await ctx.reply(message, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('Ошибка при обновлении Telegram ID студента:', err);
    await ctx.reply('🚫 Произошла ошибка при подписке. Пожалуйста, обратитесь в автошколу.');
  }
});

// Обработка кнопки "Узнать долг"
bot.callbackQuery('check_debt', async (ctx) => {
  const telegramId = ctx.chat.id.toString();

  try {
    const student = await prisma.student.findUnique({
      where: { telegramId },
      include: {
        payments: true,
        group: true,
      },
    });

    if (!student) {
      await ctx.answerCallbackQuery({ text: 'Студент не найден 😔', show_alert: true });
      return;
    }

    const trainingCost = student.trainingCost.toNumber();
    const totalPaid = student.payments.reduce((sum, p) => sum + p.amount.toNumber(), 0);
    const debt = Math.max(trainingCost - totalPaid, 0);

    await ctx.answerCallbackQuery(); // Закрыть "loading..."

    if (debt === 0) {
      await ctx.reply(
        `✅ У вас нет задолженности. Оплата за обучение в группе № ${student.group.groupNumber} произведена в полном объёме. Спасибо!\n\nℹ️ Напоминания об оплате больше не будут отправляться.`,
      );
    } else {
      await ctx.reply(`💰 Ваш долг за обучение: ${debt} ₽`);
    }
  } catch (err) {
    console.error('Ошибка при получении долга:', err);
    await ctx.reply('Произошла ошибка при получении долга. Попробуйте позже.');
  }
});

// Обработка кнопки "занятия по вождению"
bot.callbackQuery('view_sessions', async (ctx) => {
  const telegramId = ctx.chat.id.toString();

  try {
    const student = await prisma.student.findUnique({
      where: { telegramId },
      include: {
        drivingSessions: true,
      },
    });

    if (!student) {
      await ctx.answerCallbackQuery({ text: 'Студент не найден 😔', show_alert: true });
      return;
    }

    const sessions = student.drivingSessions
      .filter((session) => session.date >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5); // Показываем максимум 5 занятий

    if (sessions.length === 0) {
      await ctx.answerCallbackQuery();
      await ctx.reply('📭 У вас пока нет запланированных занятий по вождению.');
      return;
    }

    const message = sessions
      .map((s, i) => {
        const date = new Date(s.date).toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        const time = s.slot || 'время не указано';
        return `#${i + 1} — 🗓 ${date}, ⏰ ${time}`;
      })
      .join('\n');

    await ctx.answerCallbackQuery();
    await ctx.reply(`🚘 Ваши ближайшие занятия:\n\n${message}`);
  } catch (err) {
    console.error('Ошибка при получении занятий:', err);
    await ctx.reply('Произошла ошибка при получении расписания.');
  }
});

// Запуск бота
bot.start();
