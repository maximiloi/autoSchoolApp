'use client';

import { useEffect, useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useGroupStore } from '@/store/useStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  groupNumber: z.string().min(1, 'Введите номер группы'),
  category: z.enum(['A', 'B'], { required_error: 'Выберите категорию' }),
  startTrainingDate: z.date({ required_error: 'Укажите дату начала' }),
  endTrainingDate: z.date({ required_error: 'Укажите дату окончания' }),
  theoryTeachers: z
    .array(
      z.object({
        id: z.string().uuid('Неверный формат id преподавателя'),
      }),
    )
    .nonempty('Выберите хотя бы одного преподавателя'),
  practiceTeachers: z
    .array(
      z.object({
        id: z.string().uuid('Неверный формат id преподавателя'),
      }),
    )
    .nonempty('Выберите хотя бы одного преподавателя'),
});

export default function FormCreationTrainingGroup() {
  const [isLoading, setIsLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const { addGroup } = useGroupStore();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { reset, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupNumber: '',
      category: 'B',
      startTrainingDate: undefined,
      endTrainingDate: undefined,
      theoryTeachers: [],
      practiceTeachers: [],
    },
  });

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await fetch('/api/teacher');
        if (!response.ok) {
          toast({
            variant: 'destructive',
            description: 'Ошибка загрузки преподавателей.',
          });
          throw new Error('Ошибка загрузки преподавателей');
        }
        const data = await response.json();

        setTeachers(data);
      } catch (error) {
        console.error('Ошибка загрузки преподавателей:', error);
      }
    }

    fetchTeachers();
  }, []);

  async function onSubmit(values) {
    if (values.endTrainingDate < values.startTrainingDate) {
      toast({ variant: 'destructive', description: 'Дата окончания не может быть раньше начала.' });
      return;
    }

    if (status === 'authenticated') {
      setIsLoading(true);
      try {
        const requestData = {
          ...values,
          companyId: session.user.companyId,
        };

        const response = await fetch('/api/group', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const newGroup = await response.json();
          addGroup(newGroup);
          toast({
            duration: 2000,
            description: 'Группа успешно добавлен в БД',
          });
          reset();
        } else {
          toast({
            duration: 2000,
            variant: 'destructive',
            description: 'Ошибка при создании группы',
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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="groupNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер группы</FormLabel>
                <FormControl>
                  <Input placeholder="Введите номер" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['startTrainingDate', 'endTrainingDate'].map((name, index) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    {index === 0 ? 'Дата начала обучения' : 'Дата окончания обучения'}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? format(field.value, 'PPP', { locale: ru })
                            : 'Выберите дату'}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        locale={ru}
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {['theoryTeachers', 'practiceTeachers'].map((name, index) => {
            const filteredTeachers = teachers.filter((teacher) =>
              name === 'theoryTeachers'
                ? teacher.activityType === 'theory'
                : teacher.activityType === 'practice',
            );

            return (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {index === 0 ? 'Преподаватели (теория)' : 'Преподаватели (практика)'}
                    </FormLabel>
                    <div className="grid gap-2">
                      {filteredTeachers.map((teacher) => (
                        <label
                          key={teacher.id}
                          className="flex cursor-pointer items-center space-x-2"
                        >
                          <Checkbox
                            checked={(field.value ?? []).some((item) => item.id === teacher.id)}
                            onCheckedChange={(checked) => {
                              form.setValue(
                                name,
                                checked
                                  ? [...(field.value ?? []), { id: teacher.id }]
                                  : (field.value ?? []).filter((item) => item.id !== teacher.id),
                              );
                            }}
                          />
                          <span>{`${teacher.lastName} ${teacher.firstName} ${teacher.middleName || ''}`}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Создание...' : 'Создать группу'}
        </Button>
      </form>
    </Form>
  );
}
