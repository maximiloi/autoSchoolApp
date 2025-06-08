'use client';

import { Button } from '@/components/ui/button';

export default function WhatsAppButton1({ student }) {
  const { firstName, phone } = student;
  const phoneDigitsOnly = phone.replace(/\D/g, '');
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

  const telegramLink = `https://t.me/${botUsername}?start=${student.id}`;
  const message =
    `👋 Здравствуйте, ${firstName}!\n\n` +
    `📲 Это ссылка на Telegram-бот нашей автошколы:\n${telegramLink}\n\n` +
    `🔔 Подписавшись, вы будете получать:\n` +
    `📆 Напоминания о начале курса\n` +
    `🚘 Уведомления о запланированных занятиях по вождению\n` +
    `📋 Актуальный список ближайших вождений\n` +
    `💸 Напоминания об оплате — 10 и 25 числа каждого месяца\n` +
    `📊 Информацию о текущей задолженности по оплате обучения`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneDigitsOnly}&text=${encodedMessage}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button onClick={handleClick} disabled={student.telegramId}>
      Ссылка телеграм бот
    </Button>
  );
}
