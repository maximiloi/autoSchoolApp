'use client';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';

export default function WhatsAppButton1({ student }) {
  const { firstName, phone } = student;
  const phoneDigitsOnly = phone.replace(/\D/g, '');

  const totalPaid = useMemo(
    () => student?.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0,
    [student?.payments],
  );

  const debt = useMemo(
    () => Number(student?.trainingCost) - totalPaid,
    [student?.trainingCost, totalPaid],
  );

  const telegramLink = `https://t.me/okulovkaAutoSchool_bot?start=${student.id}`;
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
    if (debt > 0) {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Button onClick={handleClick} disabled={debt <= 0}>
      Ссылка телеграм бот
    </Button>
  );
}
