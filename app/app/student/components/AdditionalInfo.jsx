import { Card, CardTitle } from '@/components/ui/card';
import InputField from '@/components/ui/InputField';

export default function AdditionalInfo({ control }) {
  return (
    <Card className="mb-4 grid gap-4 p-4">
      <CardTitle>Дополнительная информация</CardTitle>
      <div className="grid grid-cols-3 gap-4">
        <InputField name="education" label="Образование" control={control} />
        <InputField name="placeOfWork" label="Место работы" control={control} />
        <InputField name="medicalRestriction" label="Мед. ограничение" control={control} />
        <InputField name="allowedCategories" label="Разрешенные категории ТС" control={control} />
        <InputField name="trainingCost" label="Стоимость обучения" control={control} />
        <InputField name="phone" label="Телефон" control={control} mask="+{7}(000)000-00-00" />
      </div>
    </Card>
  );
}
