'use client';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';

export default function WhatsAppButton({ student }) {
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

  const message =
    `Здравствуйте, ${firstName}!\n\n` +
    `Напоминаем о необходимости оплаты за обучение в автошколе ООО "КАО".\n\n` +
    `Долг за обучение: ${debt} рублей\n\n` +
    `Оплатить можно:\n` +
    `📞 СБП по номеру: +7 921 690-19-75\n` +
    `💳 на карту Сбербанка: 2202 2083 2509 3095\n` +
    `👤 Получатель: Игорь Евгеньевич Т.\n\n` +
    `Если вы уже оплатили, пожалуйста, сообщите нам 🙌\n` +
    `Спасибо!`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneDigitsOnly}&text=${encodedMessage}`;

  const handleClick = () => {
    if (debt > 0) {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Button onClick={handleClick} disabled={debt <= 0}>
      Напомнить об оплате
    </Button>
  );
}
