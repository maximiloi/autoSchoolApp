'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import createObjectActiveGroup from '@/lib/createObjectActiveGroup';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import InputField from '@/components/ui/InputField';
import DropdownField from '@/components/ui/DropdownField';
import DatePickerField from '@/components/ui/DatePickerField';

import { DOCUMENT_MASKS } from './documentMasks';
import { formSchema } from './formSchema';

export default function StudentForm({ student }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeGroups, setActiveGroups] = useState(null);
  const [sameAddress, setSameAddress] = useState(false);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { watch, reset, setValue, getValues, ...form } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentNumber: '',
      lastName: '',
      firstName: '',
      phone: '',
      group: '',
      trainingCost: '',
      birthDate: undefined,
      middleName: '',
      gender: '',
      snils: '',
      birthPlace: '',
      registrationAddress: '',
      actualAddress: '',
      documentType: 'passport',
      documentIssuer: '',
      documentCode: '',
      documentSeries: '',
      documentNumber: '',
      documentIssueDate: undefined,
      medicalSeries: '',
      medicalNumber: '',
      medicalIssueDate: undefined,
      medicalIssuer: '',
      licenseSeries: '',
      license: '',
      region: '',
      medicalRestriction: '',
      allowedCategories: '',
    },
  });
  const valuesForm = watch();
  const documentType = watch('documentType');

  useEffect(() => {
    if (status !== 'authenticated') return;

    async function fetchActiveGroups() {
      try {
        const response = await fetch(`/api/group/`);
        if (!response.ok) throw new Error('Ошибка загрузки активных групп');
        const data = await response.json();
        const groups = data.filter((group) => group.isActive);

        setActiveGroups(groups);

        if (student) reset(student);
      } catch (error) {
        console.error('Ошибка загрузки активных групп:', error.message);
        toast({
          title: 'Ошибка',
          description: `Не удалось загрузить данные активных групп. ${error.message}`,
          status: 'error',
        });
      }
    }

    fetchActiveGroups();
  }, [session]);

  useEffect(() => {
    if (!activeGroups) return;

    const selectedGroup = activeGroups.find((group) => group.id === valuesForm.group);
    if (selectedGroup && !student) {
      setValue('studentNumber', String(selectedGroup.students.length + 1));
    }
  }, [valuesForm.group]);

  useEffect(() => {
    if (sameAddress) {
      setValue('actualAddress', getValues('registrationAddress'));
    }
  }, [valuesForm.registrationAddress, sameAddress, setValue, getValues]);

  useEffect(() => {
    if (documentType && DOCUMENT_MASKS[documentType]) {
      setValue('documentSeries', '');
      setValue('documentNumber', '');
      setValue('documentCode', '');
    }
  }, [documentType, setValue]);

  async function onSubmit(values) {
    if (status !== 'authenticated') return;

    setIsLoading(true);
    try {
      const filledFieldsCount = Object.values(valuesForm).filter(Boolean).length;
      const percentageFilled = Math.round((filledFieldsCount / Object.keys(values).length) * 100);

      const requestData = {
        ...values,
        companyId: session.user.companyId,
        filledInData: percentageFilled,
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
        <div className="mt-4 flex gap-4">
          <h2 className="text-lg font-semibold">Выбрать группу: </h2>
          {activeGroups ? (
            <DropdownField
              name="group"
              label="Выберете номер группы"
              control={form.control}
              options={createObjectActiveGroup(activeGroups)}
            />
          ) : (
            <span>Загрузка...</span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_5fr_5fr_5fr_5fr] gap-4">
          <InputField name="studentNumber" label="Номер" control={form.control} />
          <InputField name="lastName" label="Фамилия" control={form.control} />
          <InputField name="firstName" label="Имя" control={form.control} />
          <InputField name="middleName" label="Отчество" control={form.control} />
          <DropdownField
            name="gender"
            label="Пол"
            control={form.control}
            options={{ male: 'Мужской', female: 'Женский' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DatePickerField name="birthDate" label="Дата рождения" control={form.control} />
          <InputField name="snils" label="СНИЛС" control={form.control} mask="000-000-000 00" />
        </div>

        <InputField name="birthPlace" label="Место рождения" control={form.control} />
        <InputField name="registrationAddress" label="Адрес регистрации" control={form.control} />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sameAddress"
            checked={sameAddress}
            onCheckedChange={(checked) => {
              setSameAddress(checked);
              if (checked) {
                setValue('actualAddress', getValues('registrationAddress'));
              } else {
                setValue('actualAddress', '');
              }
            }}
          />
          <label htmlFor="sameAddress" className="text-sm">
            Адрес фактического проживания совпадает с регистрацией
          </label>
        </div>
        <InputField name="actualAddress" label="Фактический адрес" control={form.control} />

        <h3 className="text-sm font-semibold">Документ удостоверяющий личность</h3>
        <div className="grid grid-cols-3 gap-4">
          <DropdownField
            name="documentType"
            label="Тип документа"
            control={form.control}
            options={{ passport: 'Паспорт РФ', passport_AZE: 'Паспорт Азербайджана' }}
          />
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
        <div className="grid grid-cols-[4fr_1fr_1fr] gap-4">
          <InputField name="documentIssuer" label="Кем выдан" control={form.control} />
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

        <h3 className="text-sm font-semibold">Медицинская справка</h3>
        <div className="grid grid-cols-3 gap-4">
          <InputField name="medicalSeries" label="Серия" control={form.control} />
          <InputField name="medicalNumber" label="Номер" control={form.control} />
          <DatePickerField
            name="medicalIssueDate"
            label="Дата выдачи справки"
            control={form.control}
          />
        </div>
        <InputField name="medicalIssuer" label="Кем выдана" control={form.control} />

        <h3 className="text-sm font-semibold">Лицензия</h3>
        <div className="grid grid-cols-3 gap-4">
          <InputField name="licenseSeries" label="Серия" control={form.control} />
          <InputField name="license" label="Номер" control={form.control} />
          <InputField name="region" label="Регион" control={form.control} />
        </div>

        <h3 className="text-sm font-semibold">Дополнительная информация</h3>
        <div className="grid grid-cols-2 gap-4">
          <InputField name="medicalRestriction" label="Мед. ограничение" control={form.control} />
          <InputField
            name="allowedCategories"
            label="Разрешенные категории ТС"
            control={form.control}
          />
          <InputField name="trainingCost" label="Стоимость обучения" control={form.control} />
          <InputField
            name="phone"
            label="Телефон"
            control={form.control}
            mask="+{7}(000)000-00-00"
          />
        </div>
        <div className="flex gap-4">
          {student ? (
            <Button type="submit" variant="secondary" disabled={isLoading}>
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
