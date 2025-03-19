import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function StudentPaymentModalDialog({ isOpen, onClose, student, loading }) {
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const totalPaid =
    student?.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
  const debt = Number(student?.trainingCost) - totalPaid;

  const handleAddPayment = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      ('Введите корректную сумму');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, amount: Number(amount) }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          variant: 'success',
          description: 'Платёж добавлен!',
        });
        setAmount('');
      } else {
        toast({
          variant: 'destructive',
          description: 'Ошибка: ' + data.error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Ошибка сервера',
      });
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Баланс оплаты: {student?.lastName} {student?.firstName}
          </DialogTitle>
          <DialogDescription>Введите оплату</DialogDescription>
        </DialogHeader>

        <p className="text-gray-600">
          <strong>Стоимость курса: </strong>{' '}
          {Number(student?.trainingCost.trim()).toLocaleString('ru-RU') + ' р.'}
        </p>
        <p className="text-teal-600">
          <strong>Оплачено: </strong>
          {totalPaid.toLocaleString('ru-RU') + ' р.'}
        </p>
        <p className="text-red-600">
          <strong>Долг: </strong>
          {debt.toLocaleString('ru-RU') + ' р.'}
        </p>

        <Input
          type="number"
          placeholder="Введите сумму"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={handleAddPayment} disabled={submitting || loading}>
            {submitting ? 'Добавление...' : 'Добавить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
