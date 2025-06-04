'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/ui/InputField';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  carModel: z.string(),
  carTransmission: z.enum(['mkp', 'akp']),
  carNumber: z.string(),
  literalMarking: z.string(),
  teacherId: z.string().optional(),
});

export default function CarForm({ setCars }) {
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carModel: '',
      carTransmission: '',
      carNumber: '',
      literalMarking: '',
      teacherId: '',
    },
  });

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await fetch('/api/teacher');
        if (!response.ok) throw new Error('Ошибка загрузки преподавателей');
        const data = await response.json();

        const practiceTeachers = data.filter((teacher) => teacher.activityType === 'practice');
        setTeachers(practiceTeachers);
      } catch (error) {
        console.error('Ошибка загрузки преподавателей:', error);
      }
    }

    fetchTeachers();
  }, []);

  async function onSubmit(values) {
    setIsLoading(true);

    try {
      const response = await fetch('/api/car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const newCar = await response.json();
        toast({
          duration: 2000,
          description: 'Автомобиль успешно добавлен в БД',
        });
        setCars((prev) => [...prev, newCar]);
        reset();
      } else {
        toast({
          duration: 2000,
          variant: 'destructive',
          description: 'Ошибка при создании автомобиля',
        });
      }
    } catch (error) {
      console.error('Ошибка при создании автомобиля:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className="mb-4 mt-6 text-lg font-semibold">
        ✏️ Создать автомобиль преподавателей и мастеров
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-[4fr_4fr_4fr_1fr_4fr] gap-4">
            <InputField name="carModel" label="Модель автомобиля" control={form.control} />
            <Select onValueChange={(value) => form.setValue('carTransmission', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Коробка передач" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mkp">Механическая</SelectItem>
                <SelectItem value="akp">Автоматическая</SelectItem>
              </SelectContent>
            </Select>
            <InputField
              name="carNumber"
              label="Номер автомобиля"
              control={form.control}
              mask="a 000 aa 00"
            />
            <InputField name="literalMarking" label="Буква" control={form.control} />
            <Select onValueChange={(value) => form.setValue('teacherId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите преподавателя практики" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.lastName} {teacher.firstName[0]}. {teacher.middleName[0] || ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
