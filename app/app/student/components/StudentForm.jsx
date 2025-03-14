'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useActiveGroups } from '@/hooks/useActiveGroups';
import { useStudentForm } from '@/hooks/useStudentForm';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import GroupSelection from './GroupSelection';
import PersonalInfo from './PersonalInfo';
import DocumentInfo from './DocumentInfo';
import MedicalInfo from './MedicalInfo';
import AdditionalInfo from './AdditionalInfo';
import AddressInfo from './AddressInfo';

export default function StudentForm({ student }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const { reset, form, watch, setValue, getValues, sameAddress, setSameAddress } =
    useStudentForm(student);
  const { activeGroups, loading, error } = useActiveGroups(student, reset, setValue, watch);

  async function onSubmit(values) {
    if (status !== 'authenticated') return;

    setIsLoading(true);
    try {
      const requestData = {
        ...values,
        companyId: session.user.companyId,
        id: student?.id,
      };

      const url = student?.id ? `/api/student/${student.id}` : '/api/student';

      const response = await fetch(url, {
        method: student?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        toast({
          duration: 2000,
          description: student?.id ? 'Данные ученика обновлены' : 'Ученик успешно добавлен',
        });

        reset(student ? updatedStudent : '');
      } else {
        toast({
          duration: 2000,
          variant: 'destructive',
          description: 'Ошибка при сохранении данных',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full space-y-4">
        <GroupSelection activeGroups={activeGroups} loading={loading} error={error} />
        <PersonalInfo form={form} />
        <AddressInfo
          form={form}
          setSameAddress={setSameAddress}
          sameAddress={sameAddress}
          setValue={setValue}
          getValues={getValues}
        />
        <DocumentInfo form={form} documentType={watch('documentType')} />
        <MedicalInfo form={form} />
        <AdditionalInfo form={form} />

        <div className="flex gap-4">
          {student ? (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Обновление...' : 'Обновить данные ученика'}
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Добавление...' : 'Добавить ученика'}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
