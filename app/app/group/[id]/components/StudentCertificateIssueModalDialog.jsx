import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ru } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';

export default function StudentCertificateIssueModalDialog({
  isOpen,
  onClose,
  student,
  loading,
  onSuccess,
}) {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [certificateIssueDate, setCertificateIssueDate] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && student) {
      setCertificateNumber(student.certificateNumber?.toString() || '');
      setCertificateIssueDate(
        student.certificateIssueDate ? new Date(student.certificateIssueDate) : null,
      );
    }
  }, [isOpen, student]);

  const handleAddCertificateInfo = useCallback(async () => {
    if (!student) {
      toast({ variant: 'destructive', description: 'Данные о студенте не загружены' });
      return;
    }

    if (!certificateNumber || !certificateIssueDate) {
      toast({ variant: 'destructive', description: 'Данные о свидетельстве не заполнены' });
      return;
    }

    if (certificateNumber.length !== 12) {
      toast({ variant: 'destructive', description: 'Введите ровно 12 цифр свидетельства' });
      return;
    }

    setSubmitting(true);
    try {
      const valuesData = {
        certificateNumber: Number(certificateNumber),
        certificateIssueDate,
        companyId: session.user.companyId,
        id: student?.id,
      };

      const res = await fetch(`/api/student/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valuesData),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ variant: 'success', description: 'Данные о свидетельстве добавлены!' });
        setCertificateNumber('');
        setCertificateIssueDate(null);
        onClose();
        onSuccess();
      } else {
        toast({ variant: 'destructive', description: 'Ошибка: ' + data.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', description: `Ошибка сервера: ${error}` });
    }
    setSubmitting(false);
  }, [certificateNumber, certificateIssueDate, student, onClose, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Введите номер свидетельства и дату выдачи</DialogTitle>
          <DialogDescription>
            для{' '}
            <strong className="text-xl">
              {student?.lastName} {student?.firstName}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <IMaskInput
          mask={'000000000000'}
          definitions={{
            0: /[0-9]/,
          }}
          min={0}
          radix="."
          thousandsSeparator=" "
          inputMode="numeric"
          className="w-full rounded border px-3 py-2"
          placeholder="Введите номер свидетельства"
          unmask={true}
          value={certificateNumber}
          onAccept={(value) => setCertificateNumber(value)}
        />

        <Calendar
          locale={ru}
          mode="single"
          selected={certificateIssueDate}
          onSelect={(date) => date && setCertificateIssueDate(date)}
          initialFocus
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
          <Button onClick={handleAddCertificateInfo} disabled={submitting || loading}>
            {submitting ? 'Добавление...' : 'Добавить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
