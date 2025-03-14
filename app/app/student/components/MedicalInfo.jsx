import InputField from '@/components/ui/InputField';
import DatePickerField from '@/components/ui/DatePickerField';

export default function MedicalInfo({ control }) {
  return (
    <>
      <h3 className="text-sm font-semibold">Медицинская справка и лицензия</h3>
      <div className="grid grid-cols-3 gap-4">
        <InputField name="medicalSeries" label="Серия" control={control} />
        <InputField name="medicalNumber" label="Номер" control={control} />
        <DatePickerField name="medicalIssueDate" label="Дата выдачи справки" control={control} />
      </div>
      <InputField name="medicalIssuer" label="Кем выдана" control={control} />
      <div className="grid grid-cols-3 gap-4">
        <InputField name="licenseSeries" label="Серия" control={control} />
        <InputField name="license" label="Номер" control={control} />
        <InputField name="region" label="Регион" control={control} />
      </div>
    </>
  );
}
