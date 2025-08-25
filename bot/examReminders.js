import { PrismaClient } from '@prisma/client';
import { format, isSameDay, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Bot } from 'grammy';
import { sendTelegramMessage } from './sendTelegramMessage.js';

const prisma = new PrismaClient();
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

const adminChatIds =
  process.env.TELEGRAM_ADMIN_CHAT_ID?.split(',')
    .map((id) => id.trim())
    .filter(Boolean) || [];

async function main() {
  for (const adminId of adminChatIds) {
    try {
      await bot.api.sendMessage(adminId, '⚙️ Скрипт напоминания о экзаменах запущен');
    } catch (err) {
      console.error(`Ошибка при уведомлении админа ${adminId} о запуске скрипта:`, err);
    }
  }

  const today = new Date();
  const notifyDays = [10, 5, 2, 1];

  const groups = await prisma.group.findMany({
    where: {
      isActive: true,
      endTrainingDate: {
        gte: today,
      },
    },
    include: {
      students: true,
    },
  });

  const reportLines = [];

  for (const group of groups) {
    for (const daysBefore of notifyDays) {
      const notifyDate = subDays(group.endTrainingDate, daysBefore);

      if (isSameDay(today, notifyDate)) {
        for (const student of group.students) {
          let message = '';
          const examTime = group.lessonStartTime;
          const endDate = format(group.endTrainingDate, 'dd.MM.yyyy (EEEE)', { locale: ru });
          const theoryDate = format(subDays(group.endTrainingDate, 1), 'dd.MM.yyyy (EEEE)', {
            locale: ru,
          });

          if (daysBefore === 10 || daysBefore === 5) {
            message = `📢 Уважаемый(ая) <b>${student.lastName} ${student.firstName}</b>!\n\nЧерез <b>${daysBefore - 1}</b> дней у вас начнутся экзамены:\n\n📘 <b>Теоретический экзамен</b>\n🕒 ${examTime}\n📅 ${theoryDate}\n\n🚗 <b>Практический экзамен</b>\n🕒 ${examTime}\n📅 ${endDate}`;
          }

          if (daysBefore === 2) {
            message = `📢 Уважаемый(ая) <b>${student.lastName} ${student.firstName}</b>!\n\nЗавтра у вас экзамен по <b>теории</b> 📘\n🕒 Начало: ${examTime}\n📅 Дата: ${theoryDate}\n\nА послезавтра экзамен по <b>практике</b> 🚗\n🕒 Начало: ${examTime}\n📅 Дата: ${endDate}`;
          }

          if (daysBefore === 1) {
            message = `📢 Уважаемый(ая) <b>${student.lastName} ${student.firstName}</b>!\n\nЗавтра у вас экзамен по <b>практике</b> 🚗\n🕒 Начало: ${examTime}\n📅 Дата: ${endDate}`;
          }

          if (student.telegramId) {
            await sendTelegramMessage(student.telegramId, message, { parse_mode: 'HTML' });
            reportLines.push(
              `• ${student.lastName} ${student.firstName} (${group.groupNumber}) ✅`,
            );
          } else {
            reportLines.push(
              `• ${student.lastName} ${student.firstName} (${group.groupNumber}) 📞 ${student.phone}`,
            );
          }
        }
      }
    }
  }

  if (reportLines.length > 0) {
    const reportMessage = `📤 Отправлены напоминания о экзаменах:\n\n${reportLines.join('\n\n')}`;
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
