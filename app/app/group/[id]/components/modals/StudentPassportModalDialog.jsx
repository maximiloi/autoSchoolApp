import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';
import transformedNullAndStringDate from '@/lib/transformedNullAndStringDate';
import { zodResolver } from '@hookform/resolvers/zod';

import { DOCUMENT_MASKS } from '@/app/app/student/components/documentMasks';
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
import DropdownField from '@/components/ui/DropdownField';
import { Form } from '@/components/ui/form';
import InputField from '@/components/ui/InputField';

const formSchema = z.object({
  documentType: z.enum(['passport', 'passport_AZE']).optional(),
  documentIssuer: z.string().optional(),
  documentCode: z.string().optional(),
  documentSeries: z.string().optional(),
  documentNumber: z.string().optional(),
  documentIssueDate: z.date().optional(),
});

export default function StudentPassportModalDialog({
  isOpen,
  onClose,
  student,
  loading,
  onSuccess,
}) {
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { watch, reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentType: student?.documentType,
      documentIssuer: '',
      documentCode: '',
      documentSeries: '',
      documentNumber: '',
      documentIssueDate: undefined,
    },
  });
  const documentType = watch('documentType');

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
          <DialogTitle>Документ удостоверяющий личность</DialogTitle>
          <DialogDescription>
            для{' '}
            <strong className="text-xl">
              {student?.lastName} {student?.firstName}
            </strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <DropdownField
              name="documentType"
              label="Тип документа"
              control={form.control}
              options={{ passport: 'Паспорт РФ', passport_AZE: 'Паспорт Азербайджана' }}
            />
            <div className="grid grid-cols-2 gap-2">
              <InputField
                name="documentSeries"
                label={DOCUMENT_MASKS[documentType]?.labelSeries || ''}
                control={form.control}
                mask={DOCUMENT_MASKS[documentType]?.series || ''}
              />
              <InputField
                name="documentNumber"
                label={DOCUMENT_MASKS[documentType]?.labelNumber || ''}
                control={form.control}
                mask={DOCUMENT_MASKS[documentType]?.number || ''}
              />
            </div>
            <InputField name="documentIssuer" label="Кем выдан" control={form.control} />
            <div className="grid grid-cols-2 gap-2">
              <InputField
                name="documentCode"
                label={DOCUMENT_MASKS[documentType]?.labelCode || ''}
                control={form.control}
                mask={DOCUMENT_MASKS[documentType]?.code || ''}
              />
              <DatePickerField
                name="documentIssueDate"
                label="Дата выдачи документа"
                control={form.control}
              />
            </div>

            <DialogFooter className="pt-4">
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
