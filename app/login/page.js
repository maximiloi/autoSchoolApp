'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

export default function Login() {
  const router = useRouter();
  const { status } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const res = await signIn('credentials', { ...data, redirect: false });
    setLoading(false);

    if (res?.ok) {
      router.push('/app');
      toast({
        variant: 'success',
        title: 'Добро пожаловать',
        // description: 'Неверные учетные данные',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Ошибка авторизации',
        description: 'Неверные учетные данные',
      });
    }
  };

  if (status === 'loading') return <p>Загрузка...</p>;

  return (
    <div className="flex h-screen items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded bg-white p-6 shadow-lg"
        >
          <h1 className="mb-4 text-xl">Вход</h1>

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Пароль" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4 flex items-center gap-2" disabled={loading}>
            {loading ? (
              'Вход...'
            ) : (
              <>
                <LogIn size={16} /> <span>Войти</span>
              </>
            )}
          </Button>

          <p className="mt-4 text-sm">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-blue-500 hover:underline">
              Регистрация
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
