import InputField from '@/components/ui/InputField';

export default function AdditionalInfo({ control }) {
  return (
    <>
      <h3 className="text-sm font-semibold">Дополнительная информация</h3>
      <div className="grid grid-cols-3 gap-4">
        <InputField name="education" label="Образование" control={control} />
        <InputField name="placeOfWork" label="Место работы" control={control} />
        <InputField name="medicalRestriction" label="Мед. ограничение" control={control} />
        <InputField name="allowedCategories" label="Разрешенные категории ТС" control={control} />
        <InputField name="trainingCost" label="Стоимость обучения" control={control} />
        <InputField name="phone" label="Телефон" control={control} mask="+{7}(000)000-00-00" />
      </div>
    </>
  );
}
