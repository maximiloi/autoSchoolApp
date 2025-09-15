import { PrismaClient } from '@prisma/client';
import { addDays, format } from 'date-fns';
import { Bot } from 'grammy';

const prisma = new PrismaClient();
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

const adminChatIds =
  process.env.TELEGRAM_ADMIN_CHAT_ID?.split(',')
    .map((id) => id.trim())
    .filter(Boolean) || [];

function formatTimeRange(slot) {
  if (!slot) return '';
  const match = slot.match(/(\d{1,2})\s*-\s*(\d{1,2})/);
  if (match) {
    const [, from, to] = match;
    return `с ${from} до ${to}`;
  }
  return slot;
}

function getStartHour(timeText) {
  if (!timeText) return 0;
  const match = timeText.match(/с (\d{1,2})/);
  return match ? parseInt(match[1], 10) : 0;
}

async function main() {
  for (const adminId of adminChatIds) {
    try {
      await bot.api.sendMessage(adminId, '⚙️ Скрипт напоминания о вождении запущен');
    } catch (err) {
      console.error(`Ошибка при уведомлении админа ${adminId} о запуске скрипта:`, err);
    }
  }

  const tomorrow = addDays(new Date(), 1);
  const startOfDay = new Date(tomorrow.setHours(0, 0, 0, 0));
  const endOfDay = new Date(tomorrow.setHours(23, 59, 59, 999));

  const tomorrowSessions = await prisma.drivingSession.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      student: {
        include: {
          group: {
            include: {
              practiceTeachers: true,
            },
          },
        },
      },
    },
  });

  const reportLines = [];
  const teacherSessions = {};

  for (const session of tomorrowSessions) {
    const { student, date: sessionDate, slot: sessionTime } = session;
    const timeText = sessionTime ? formatTimeRange(sessionTime) : '';
    const formattedDate = format(sessionDate, 'dd.MM.yyyy');

    const teacher = student.group.practiceTeachers[0];
    const teacherFullName = teacher
      ? `${teacher.lastName} ${teacher.firstName} ${teacher.middleName ?? ''}`.trim()
      : '—';
    const teacherPhone = teacher?.phone || '—';

    const fullName = `${student.lastName} ${student.firstName} ${student.middleName ?? ''}`.trim();
    const groupNumber = student.group?.groupNumber || '—';

    if (student.telegramId) {
      const studentMessage = `🚗 Напоминание: у вас завтра вождение ${timeText} (${formattedDate})\n\n 👨‍🏫 Инструктор: ${teacherFullName}\n📞 ${teacherPhone}`;
      try {
        await bot.api.sendMessage(student.telegramId, studentMessage);
        reportLines.push(`• ${fullName} — #${groupNumber} — ${formattedDate} ${timeText || ''}`);
      } catch (error) {
        console.error(`Ошибка при отправке студенту ${fullName}:`, error);

        if (error.error_code == 403 && error.description.includes('bot was blocked')) {
          await prisma.student.update({
            where: { id: student.id },
            data: { telegramId: null },
          });

          const removalMsg = `⚠️ Студент *${fullName}* из группы *${groupNumber}* заблокировал бота. Telegram ID удалён из базы.`;

          for (const adminId of adminChatIds) {
            try {
              await bot.api.sendMessage(adminId, removalMsg, { parse_mode: 'Markdown' });
            } catch (err) {
              console.error(`Ошибка при отправке админу ${adminId} об удалении студента:`, err);
            }
          }
        }
      }
    }

    if (teacher?.telegramId) {
      if (!teacherSessions[teacher.id]) {
        teacherSessions[teacher.id] = {
          telegramId: teacher.telegramId,
          groupNumber: groupNumber,
          sessions: [],
        };
      }
      teacherSessions[teacher.id].sessions.push({
        timeText,
        formattedDate,
        fullName,
        phone: student.phone || '—',
      });
    }
  }

  for (const teacherId in teacherSessions) {
    const { telegramId, groupNumber, sessions } = teacherSessions[teacherId];
    sessions.sort((a, b) => getStartHour(a.timeText) - getStartHour(b.timeText));

    const teacherMessage =
      `🚗 Завтра (${sessions[0].formattedDate}) вождение для группы #${groupNumber}\n\n` +
      sessions.map((s, i) => `${i + 1}. ${s.timeText} — ${s.fullName} (${s.phone})`).join('\n\n');

    try {
      await bot.api.sendMessage(telegramId, teacherMessage);
    } catch (error) {
      console.error(`Ошибка при отправке преподавателю ${telegramId}:`, error);
    }
  }

  if (reportLines.length > 0) {
    const reportMessage = `📤 Отправлены напоминания о вождении:\n\n${reportLines.join('\n\n')}`;

    for (const adminId of adminChatIds) {
      try {
        await bot.api.sendMessage(adminId, reportMessage);
      } catch (error) {
        console.error(`Ошибка при отправке отчета админу ${adminId}:`, error);
      }
    }
  } else {
    console.log('Нет занятий по вождению на завтра.');
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
