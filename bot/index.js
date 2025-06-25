import { PrismaClient } from '@prisma/client';
import { Bot, InlineKeyboard } from 'grammy';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);
const prisma = new PrismaClient();
const adminChatIds = process.env.TELEGRAM_ADMIN_CHAT_ID?.split(',')
  .map((id) => id.trim())
  .filter(Boolean);

// /start с параметром ?start=studentId
bot.command('start', async (ctx) => {
  const chatId = ctx.chat.id.toString();
  const studentId = ctx.match;

  if (!studentId) {
    await ctx.reply('❗️Ошибка: отсутствует код. Пожалуйста, используйте QR-код из Договора.');
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

    await prisma.student.update({
      where: { id: student.id },
      data: { telegramId: chatId },
    });

    const fullName = `${student.lastName} ${student.firstName} ${student.middleName ?? ''}`.trim();
    const groupNumber = student.group?.groupNumber ?? '—';
    const activationMessage = `📲 Студент <b>${fullName}</b> из группы № <b>${groupNumber}</b> активировал Telegram-бот.`;

    await Promise.all(
      adminChatIds.map(async (adminId) => {
        try {
          await bot.api.sendMessage(adminId, activationMessage, { parse_mode: 'HTML' });
        } catch (error) {
          console.error(`Ошибка при уведомлении админа ${adminId}:`, error);
        }
      }),
    );

    // Сообщение студенту
    const message = `
    👋 Здравствуйте, <b>${student.lastName} ${student.firstName}</b>!
    
    ✅ Вы успешно <b>подписались на уведомления</b>.
    
    ℹ️ Вы проходите обучение в группе № <b>${student.group.groupNumber}</b>, начало занятий — <b>${student.group.startTrainingDate.toLocaleDateString('ru-RU')} г</b>.
    💳 Стоимость курса составляет <b>${student.trainingCost.toFixed(2).toLocaleString('ru-RU')} ₽</b>.
    
    📬 Теперь вы будете получать:
    • 🚗 Уведомления о запланированных занятиях по вождению
    • 💰 Напоминания об оплате — <b>8</b> и <b>23</b> числа каждого месяца

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
    if (err.code === 'P2002' && err.meta?.target?.includes('telegramId')) {
      await ctx.reply(
        '⚠️ Этот Telegram-аккаунт уже привязан к другому студенту.\n\n' +
          'Попробуйте войти с другого аккаунта или сообщите об этом в автошколу.',
      );
    } else {
      console.error('Ошибка при обновлении Telegram ID студента:', err);
      await ctx.reply('🚫 Произошла ошибка при подписке. Пожалуйста, обратитесь в автошколу.');
    }
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

    await ctx.answerCallbackQuery();

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
    await ctx.reply(`🚘 Ваши ближайшие вождения:\n\n${message}`);
  } catch (err) {
    console.error('Ошибка при получении занятий:', err);
    await ctx.reply('Произошла ошибка при получении расписания.');
  }
});

// Обработка кнопки "оплатил"
bot.callbackQuery(/^payment_done_(.+)$/, async (ctx) => {
  const studentId = ctx.match[1];

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { group: true, payments: true },
    });

    if (!student) {
      await ctx.answerCallbackQuery({ text: 'Студент не найден.', show_alert: true });
      return;
    }

    await ctx.editMessageText(
      `✅ Спасибо, ${student.firstName}! Мы получили информацию об оплате.\n\nПоступление оплат обрабатывается вручную. Как только оплата будет внесена в систему, вы получите подтверждение сообщением.`,
    );

    const nameText =
      `${student.firstName} ${student.middleName ?? ''} ${student.lastName[0]}.`.trim();
    const groupNumber = student.group?.groupNumber ?? '—';
    const adminKeyboard = new InlineKeyboard().text(
      '✅ Внесено в систему',
      `confirm_payment_${student.id}`,
    );

    await Promise.all(
      adminChatIds.map(async (id) => {
        try {
          await bot.api.sendMessage(
            id,
            `💼 Студент <b>${nameText}</b> из группы № <b>${groupNumber}</b> отметил оплату.`,
            { parse_mode: 'HTML', reply_markup: adminKeyboard },
          );
        } catch (err) {
          console.error(`Не удалось отправить сообщение админу ${id}:`, err);
        }
      }),
    );
  } catch (error) {
    console.error('Ошибка при обработке оплаты:', error);
    await ctx.answerCallbackQuery({ text: 'Произошла ошибка.', show_alert: true });
  }
});

// Обработка кнопки "Внесено в систему"
bot.callbackQuery(/^confirm_payment_(.+)$/, async (ctx) => {
  const studentId = ctx.match[1];

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        group: true,
        payments: true,
      },
    });

    if (!student?.telegramId) {
      await ctx.answerCallbackQuery({
        text: 'Студент не найден или нет Telegram ID.',
        show_alert: true,
      });
      return;
    }

    const trainingCost = student.trainingCost.toNumber();
    const totalPaid = student.payments.reduce((sum, p) => sum + p.amount.toNumber(), 0);
    const debt = Math.max(trainingCost - totalPaid, 0);

    const debtMessage =
      debt === 0
        ? '✅ Оплата за курс внесена в полном объёме. Спасибо!\n\nℹ️ Напоминания про оплату больше не будут приходить.'
        : `ℹ️ После внесения оплаты в систему, ваша <b>оставшаяся сумма к оплате</b>: <b>${debt} ₽</b>.`;

    await bot.api.sendMessage(
      student.telegramId,
      `✅ Мы внесли вашу оплату в систему.\n\n${debtMessage}`,
      { parse_mode: 'HTML' },
    );

    const fullName = `${student.lastName} ${student.firstName} ${student.middleName ?? ''}`.trim();
    const groupNum = student.group?.groupNumber ?? '—';

    await ctx.editMessageText(
      `☑️ Уведомление отправлено студенту: <b>${fullName}</b> (группа № <b>${groupNum}</b>)`,
      { parse_mode: 'HTML' },
    );

    await ctx.answerCallbackQuery();
  } catch (error) {
    console.error('Ошибка при подтверждении оплаты:', error);
    await ctx.answerCallbackQuery({ text: 'Ошибка при отправке уведомления.', show_alert: true });
  }
});

// Запуск бота
bot.start();
