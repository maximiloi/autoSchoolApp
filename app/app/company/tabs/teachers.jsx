'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import InputField from '@/components/ui/InputField';

const formSchema = z.object({
  lastName: z.string().min(2, 'Введите фамилию'),
  firstName: z.string().min(2, 'Введите имя'),
  middleName: z.string().optional(),
  activityType: z.enum(['theory', 'practice'], { required_error: 'Выберите вид деятельности' }),
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  address: z.string().optional(),
  licenseSeries: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseIssueDate: z.string().optional(),
  snils: z.string().optional(),
});

export default function TeachersForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: '',
      firstName: '',
      middleName: '',
      activityType: 'theory',
      birthDate: '',
      birthPlace: '',
      address: '',
      licenseSeries: '',
      licenseNumber: '',
      licenseIssueDate: '',
      snils: '',
    },
  });

  async function onSubmit(values) {
    setIsLoading(true);

    try {
      const response = await fetch('/api/teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          duration: 2000,
          description: 'Преподаватель успешно добавлен в БД',
        });
        reset();
        router.refresh();
      } else {
        toast({
          duration: 2000,
          variant: 'destructive',
          description: 'Ошибка при создании преподавателя',
        });
      }
    } catch (err) {
      toast({
        duration: 2000,
        variant: 'destructive',
        description: `Ошибка: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="mb-4 mt-6 text-lg font-semibold">
        ✏️ Редактировать преподавателей и мастеров
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <InputField name="lastName" label="Фамилия" control={form.control} />
            <InputField name="firstName" label="Имя" control={form.control} />
            <InputField name="middleName" label="Отчество" control={form.control} />
            <InputField
              name="birthDate"
              label="Дата рождения (ДД.ММ.ГГГГ)"
              control={form.control}
            />
          </div>

          <FormField
            control={form.control}
            name="activityType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Вид деятельности</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="theory">Преподаватель теории</SelectItem>
                    <SelectItem value="practice">Преподаватель практики</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <InputField name="birthPlace" label="Место рождения" control={form.control} />
          <InputField name="address" label="Адрес" control={form.control} />

          <h3 className="text-md font-semibold">Водительское удостоверение</h3>
          <div className="grid grid-cols-4 gap-4">
            <InputField name="licenseSeries" label="Серия" control={form.control} />
            <InputField name="licenseNumber" label="Номер" control={form.control} />
            <InputField
              name="licenseIssueDate"
              label="Дата выдачи (ДД.ММ.ГГГГ)"
              control={form.control}
            />
            <InputField name="snils" label="СНИЛС" control={form.control} />
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="destructive" disabled={isLoading}>
              Удалить
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
