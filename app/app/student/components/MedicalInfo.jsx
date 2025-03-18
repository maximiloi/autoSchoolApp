import { Card, CardTitle } from '@/components/ui/card';
import InputField from '@/components/ui/InputField';
import DatePickerField from '@/components/ui/DatePickerField';

export default function MedicalInfo({ control }) {
  return (
    <Card className="mb-4 grid gap-4 p-4">
      <CardTitle>Информация о медицинской справки</CardTitle>
      <div className="grid grid-cols-3 gap-4">
        <InputField name="medicalSeries" label="Серия справки" control={control} />
        <InputField name="medicalNumber" label="Номер справки" control={control} />
        <DatePickerField name="medicalIssueDate" label="Дата выдачи справки" control={control} />
      </div>
      <InputField name="medicalIssuer" label="Кем выдана" control={control} />
      <div className="grid grid-cols-3 gap-4">
        <InputField name="licenseSeries" label="Серия лицензии" control={control} />
        <InputField name="license" label="Номер лицензии" control={control} />
        <InputField name="region" label="Регион выдачи лицензии" control={control} />
      </div>
    </Card>
  );
}
