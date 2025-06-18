import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';
import transformedNullAndStringDate from '@/lib/transformedNullAndStringDate';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import DatePickerField from '@/components/ui/DatePickerField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import InputField from '@/components/ui/InputField';

const formSchema = z.object({
  medicalSeries: z.string().optional(),
  medicalNumber: z.string().optional(),
  medicalIssueDate: z.date().optional(),
  medicalIssuer: z.string().optional(),
  licenseSeries: z.string().optional(),
  license: z.string().optional(),
  region: z.string().optional(),
});

export default function StudentMedicalCertificateModalDialog({
  isOpen,
  onClose,
  student,
  loading,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicalSeries: '',
      medicalNumber: '',
      medicalIssueDate: undefined,
      medicalIssuer: '',
      licenseSeries: '',
      license: '',
      region: '',
    },
  });

  useEffect(() => {
    if (student) {
      reset(transformedNullAndStringDate(student));
    }
  }, [student, reset]);

  const onSubmit = useCallback(
    async (valuesData) => {
      if (!student) {
        toast({ variant: 'destructive', description: 'Данные о студенте не загружены' });
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch(`/api/student/${student.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(valuesData),
        });

        const data = await res.json();
        if (res.ok) {
          toast({ variant: 'success', description: 'Данные о медицинской справки добавлены!' });
          onClose();
          onSuccess();
        } else {
          toast({ variant: 'destructive', description: 'Ошибка: ' + data.error });
        }
      } catch (error) {
        toast({ variant: 'destructive', description: `Ошибка сервера: ${error}` });
      }
      setSubmitting(false);
    },
    [student, onClose, onSuccess, toast],
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Информация о медицинской справки</DialogTitle>
          <DialogDescription>
            для{' '}
            <strong className="text-xl">
              {student?.lastName} {student?.firstName}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <InputField name="medicalSeries" label="Серия справки" control={form.control} />
              <InputField name="medicalNumber" label="Номер справки" control={form.control} />
            </div>
            <DatePickerField
              name="medicalIssueDate"
              label="Дата выдачи справки"
              control={form.control}
            />
            <InputField name="medicalIssuer" label="Кем выдана" control={form.control} />
            <div className="grid grid-cols-2 gap-2">
              <InputField name="licenseSeries" label="Серия лицензии" control={form.control} />
              <InputField name="license" label="Номер лицензии" control={form.control} />
            </div>
            <InputField name="region" label="Регион выдачи лицензии" control={form.control} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Закрыть
              </Button>
              <Button type="submit" disabled={submitting || loading}>
                {submitting ? 'Добавление...' : 'Добавить'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
