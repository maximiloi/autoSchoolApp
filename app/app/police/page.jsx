'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { toast } from '@/hooks/use-toast';

const FormSchema = z.object({
  departmentName: z.string().min(1, { message: 'Название отдела обязательно.' }),
  officerName: z.string().optional(),
  officerRank: z.string().optional(),
  district: z.string().optional(),
});

export default function PolicePage() {
  const [loading, setLoading] = useState(true);
  const [gibddData, setGibddData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      departmentName: '',
      officerName: '',
      officerRank: '',
      district: '',
    },
  });

  useEffect(() => {
    async function fetchGibddData() {
      try {
        const response = await fetch('/api/gibdd');
        const data = await response.json();
        if (response.ok) {
          setGibddData(data);
          form.reset({
            departmentName: data.departmentName || '',
            officerName: data.officerName || '',
            officerRank: data.officerRank || '',
            district: data.district || '',
          });
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные ГИБДД.',
          variant: 'destructive',
        });
        console.error('Ошибка при загрузке данных ГИБДД:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGibddData();
  }, [form]);

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/gibdd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        toast({
          title: 'Успех!',
          description: 'Данные ГИБДД сохранены.',
          variant: 'success',
        });
        setGibddData(result.data);
      } else {
        toast({
          title: 'Ошибка',
          description: result.error || 'Не удалось сохранить данные.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке данных.',
        variant: 'destructive',
      });
      console.error('Ошибка при отправке данных ГИБДД:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Реквизиты ГИБДД</h2>
      {gibddData && (
        <>
          <p className="text-sm text-muted-foreground">Tак текст будет выглядеть в документе</p>
          <blockquote className="mt-6 border-l-2 pl-6">
            <p className="mb-4 whitespace-pre-line text-left text-base leading-relaxed">
              Начальнику {gibddData?.departmentName?.replace(',', '\n') || ''}
              {'\n'}
              {gibddData?.officerRank && gibddData?.officerName
                ? `${gibddData.officerRank} ${gibddData.officerName}`
                : ''}
            </p>
          </blockquote>
        </>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="departmentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Название отдела ГИБДД (запятая переносить текст на новую строку)
                </FormLabel>
                <FormControl>
                  <Input placeholder="Введите название отдела" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="officerRank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Звание офицера</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите звание офицера" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="officerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя офицера</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите имя офицера" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
