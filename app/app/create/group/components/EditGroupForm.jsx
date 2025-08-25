'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

import { Input } from '@/components/ui/input';
import { useGroupStore } from '@/store/useStore';
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  startTrainingDate: z.date(),
  endTrainingDate: z.date(),
  lessonStartTime: z.string(),
  maxStudents: z.coerce.number().int(),
});

export default function EditGroupForm({ group, onSuccess }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTrainingDate: new Date(group.startTrainingDate),
      endTrainingDate: new Date(group.endTrainingDate),
      lessonStartTime: group.lessonStartTime,
      maxStudents: group.maxStudents,
    },
  });

  const onSubmit = async (values) => {
    if (values.endTrainingDate < values.startTrainingDate) {
      toast({ variant: 'destructive', description: 'Дата окончания раньше даты начала курса' });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/group/${group.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Ошибка при изменении дат');

      const updated = await response.json();
      const { setGroup } = useGroupStore.getState();
      setGroup(updated);

      toast({ description: 'Даты курса успешно изменены' });
      if (onSuccess) onSuccess(updated);
    } catch (err) {
      toast({ variant: 'destructive', description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {['startTrainingDate', 'endTrainingDate'].map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {name === 'startTrainingDate' ? 'Начало занятий' : 'Окончание занятий'}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn('w-full text-left', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'PPP', { locale: ru }) : 'Выберите дату'}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      locale={ru}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="maxStudents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Максимальное число студентов</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Например, 12" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lessonStartTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Время начала занятий</FormLabel>
              <FormControl>
                <Input placeholder="Например, 10:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить даты'}
        </Button>
      </form>
    </Form>
  );
}
