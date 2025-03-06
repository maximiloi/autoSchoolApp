'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import InputField from '@/components/ui/InputField';
import DatePickerField from '@/components/ui/DatePickerField';
import { CompanyFormSchema } from './company-formSchema';
import { useCompanyStore } from '@/store/useStore';

export default function CompanyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const { setCompany } = useCompanyStore();
  const { reset, ...form } = useForm({
    resolver: zodResolver(CompanyFormSchema),
    defaultValues: {
      companyName: '',
      shortName: '',
      license: '',
      whoIssuedLicense: '',
      whenIssuedLicense: undefined,
      inn: '',
      kpp: '',
      ogrn: '',
      legalAddress: '',
      actualAddress: '',
      region: '',
      city: '',
      bank: '',
      account: '',
      bik: '',
      correspondentAccount: '',
      directorSurname: '',
      directorName: '',
      directorPatronymic: '',
      accountantSurname: '',
      accountantName: '',
      accountantPatronymic: '',
      phone: '',
      email: '',
      website: '',
    },
  });

  useEffect(() => {
    if (!session?.user?.companyId) return;
    async function fetchCompany() {
      try {
        const response = await fetch(`/api/company/${session.user.companyId}`);
        if (response.ok) {
          const companyData = await response.json();
          reset(companyData);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных компании', error.message);
        toast({
          duration: 2000,
          variant: 'destructive',
          description: 'Ошибка при загрузке данных компании',
        });
      }
    }
    fetchCompany();
  }, [session]);

  async function onSubmit(values) {
    setIsLoading(true);

    try {
      const method = session?.user?.companyId ? 'PUT' : 'POST';
      const url = session?.user?.companyId
        ? `/api/company/${session?.user?.companyId}`
        : '/api/company';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          description: session?.user?.companyId
            ? 'Данные компании обновлены'
            : 'Компания успешно добавлена',
        });
        const companyData = await response.json();
        setCompany(companyData);
        reset(companyData);
      } else {
        toast({
          variant: 'destructive',
          description: session?.user?.companyId
            ? 'Ошибка обновления данных компании'
            : 'Ошибка добавления компании',
        });
      }
    } catch (err) {
      toast({ duration: 2000, variant: 'destructive', description: `Ошибка: ${err.message}` });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Section2 title="Основная информация">
          <InputField name="companyName" label="Название компании" control={form.control} />
          <InputField name="shortName" label="Краткое название" control={form.control} />
        </Section2>

        <Section title="Лицензия">
          <InputField name="license" label="Номер лицензии" control={form.control} />
          <InputField name="whoIssuedLicense" label="Кем выдана" control={form.control} />
          <DatePickerField name="whenIssuedLicense" label="Когда выдана" control={form.control} />
        </Section>

        <Section title="Юридические данные">
          <InputField name="inn" label="ИНН" control={form.control} />
          <InputField name="kpp" label="КПП" control={form.control} />
          <InputField name="ogrn" label="ОГРН" control={form.control} />
        </Section>

        <Section1 title="Адреса">
          <InputField name="legalAddress" label="Юридический адрес" control={form.control} />
          <InputField name="actualAddress" label="Фактический адрес" control={form.control} />
        </Section1>

        <Section title="Банковские реквизиты">
          <InputField name="region" label="Регион" control={form.control} />
          <InputField name="city" label="Населенный пункт" control={form.control} />
          <InputField name="bank" label="Банк" control={form.control} />
          <InputField name="account" label="Расчетный счет" control={form.control} />
          <InputField name="bik" label="БИК" control={form.control} />
          <InputField
            name="correspondentAccount"
            label="Корреспондентский счет"
            control={form.control}
          />
        </Section>

        <Section title="Директор">
          <InputField name="directorSurname" label="Фамилия" control={form.control} />
          <InputField name="directorName" label="Имя" control={form.control} />
          <InputField name="directorPatronymic" label="Отчество" control={form.control} />
        </Section>

        <Section title="Бухгалтер">
          <InputField name="accountantSurname" label="Фамилия" control={form.control} />
          <InputField name="accountantName" label="Имя" control={form.control} />
          <InputField name="accountantPatronymic" label="Отчество" control={form.control} />
        </Section>

        <Section title="Контакты">
          <InputField name="phone" label="Телефон" control={form.control} />
          <InputField name="email" label="Email" control={form.control} />
          <InputField name="website" label="Сайт" control={form.control} />
        </Section>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </form>
    </Form>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </h3>
      <div className="grid grid-cols-3 gap-4">{children}</div>
    </div>
  );
}

function Section1({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </h3>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function Section2({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </div>
  );
}
