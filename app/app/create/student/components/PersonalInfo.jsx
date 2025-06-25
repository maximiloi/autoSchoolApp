import { Card, CardTitle } from '@/components/ui/card';
import InputField from '@/components/ui/InputField';
import DropdownField from '@/components/ui/DropdownField';
import DatePickerField from '@/components/ui/DatePickerField';

export default function PersonalInfo({ control }) {
  return (
    <Card className="mb-4 grid gap-4 p-4">
      <CardTitle>Личная информация</CardTitle>
      <div className="grid grid-cols-[1fr_5fr_5fr_5fr_5fr] gap-4">
        <InputField name="studentNumber" label="Номер" control={control} />
        <InputField name="lastName" label="Фамилия" control={control} />
        <InputField name="firstName" label="Имя" control={control} />
        <InputField name="middleName" label="Отчество" control={control} />
        <DropdownField
          name="gender"
          label="Пол"
          control={control}
          options={{ male: 'Мужской', female: 'Женский' }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <DatePickerField name="birthDate" label="Дата рождения" control={control} />
        <InputField name="birthPlace" label="Место рождения" control={control} />
        <InputField name="snils" label="СНИЛС" control={control} mask="000-000-000 00" />
      </div>
    </Card>
  );
}
