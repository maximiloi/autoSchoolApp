import { Bot } from 'grammy';

const token = process.env.TELEGRAM_BOT_TOKEN;
export const bot = new Bot(token);

export async function sendTelegramMessage(chatId, text, options = {}) {
  try {
    await bot.api.sendMessage(chatId, text, options);
  } catch (error) {
    console.error('Ошибка при отправке сообщения:', error);
  }
}
