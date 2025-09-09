import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo, useState } from 'react';
import { IMaskInput } from 'react-imask';

export default function StudentPaymentModalDialog({
  isOpen,
  onClose,
  student,
  loading,
  onPaymentSuccess,
}) {
  const { data: session } = useSession();
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const totalPaid = useMemo(
    () => student?.payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0,
    [student?.payments],
  );

  const debt = useMemo(
    () => Number(student?.trainingCost) - totalPaid,
    [student?.trainingCost, totalPaid],
  );

  const isDirector = useMemo(
    () => (session?.user?.role?.toUpperCase?.() ?? '') === 'DIRECTOR',
    [session],
  );

  const handleAddPayment = useCallback(async () => {
    if (!student) {
      toast({ variant: 'destructive', description: 'Данные о студенте не загружены' });
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({ variant: 'destructive', description: 'Введите корректную сумму' });
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
        toast({ variant: 'success', description: 'Платёж добавлен!' });
        setAmount('');
        onPaymentSuccess();
        onClose();
      } else {
        toast({ variant: 'destructive', description: 'Ошибка: ' + data.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', description: `Ошибка сервера ${error}` });
    }
    setSubmitting(false);
  }, [amount, student, onPaymentSuccess, onClose, toast]);

  const handleDeletePayment = useCallback(
    async (paymentId) => {
      if (!confirm('Вы уверены, что хотите удалить этот платёж?')) return;

      setSubmitting(true);
      try {
        const res = await fetch(`/api/payments/${paymentId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          toast({ variant: 'success', description: 'Платёж удалён!' });
          onPaymentSuccess();
          onClose();
        } else {
          const data = await res.json();
          toast({ variant: 'destructive', description: 'Ошибка: ' + data.error });
        }
      } catch (error) {
        toast({ variant: 'destructive', description: `Ошибка сервера ${error}` });
      }
      setSubmitting(false);
    },
    [onPaymentSuccess, onClose, toast],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Баланс оплаты: {student?.lastName} {student?.firstName}
          </DialogTitle>
          <DialogDescription>
            <strong>Стоимость курса: </strong>{' '}
            {Number(student?.trainingCost.trim()).toLocaleString('ru-RU') + ' ₽'}
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата платежа</TableHead>
              <TableHead>Сумма (₽)</TableHead>
              {isDirector && <TableHead>Удалить</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {student?.payments?.length > 0 ? (
              student.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(new Date(payment.paymentDate), 'PPP', { locale: ru })}
                  </TableCell>
                  <TableCell>{Number(payment.amount).toLocaleString('ru-RU')}</TableCell>
                  {isDirector && (
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePayment(payment.id)}
                        disabled={submitting || loading}
                      >
                        <X />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>Платежей пока нет</TableCell>
              </TableRow>
            )}
          </TableBody>
          {!!student?.payments?.length && (
            <TableFooter>
              <TableRow>
                <TableCell>Оплачено</TableCell>
                <TableCell className="text-right">{totalPaid.toLocaleString('ru-RU')} ₽</TableCell>
                <TableCell />
              </TableRow>
            </TableFooter>
          )}
        </Table>

        <p className="text-red-600">
          <strong>Долг: </strong>
          {debt.toLocaleString('ru-RU') + ' ₽'}
        </p>

        <IMaskInput
          mask={Number}
          min={0}
          max={debt}
          radix="."
          thousandsSeparator=" "
          inputMode="numeric"
          className="w-full rounded border px-3 py-2"
          placeholder="Введите сумму"
          unmask={true}
          value={amount}
          onAccept={(value) => setAmount(value)}
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
