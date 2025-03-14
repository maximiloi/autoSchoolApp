import InputField from '@/components/ui/InputField';
import DropdownField from '@/components/ui/DropdownField';
import DatePickerField from '@/components/ui/DatePickerField';
import { DOCUMENT_MASKS } from './documentMasks';

export default function DocumentInfo({ control, documentType }) {
  return (
    <>
      <h3 className="text-sm font-semibold">Документ удостоверяющий личность</h3>
      <div className="grid grid-cols-3 gap-4">
        <DropdownField
          name="documentType"
          label="Тип документа"
          control={control}
          options={{ passport: 'Паспорт РФ', passport_AZE: 'Паспорт Азербайджана' }}
        />
        <InputField
          name="documentSeries"
          label={DOCUMENT_MASKS[documentType]?.labelSeries || ''}
          control={control}
          mask={DOCUMENT_MASKS[documentType]?.series || ''}
        />
        <InputField
          name="documentNumber"
          label={DOCUMENT_MASKS[documentType]?.labelNumber || ''}
          control={control}
          mask={DOCUMENT_MASKS[documentType]?.number || ''}
        />
      </div>
      <div className="grid grid-cols-[4fr_1fr_1fr] gap-4">
        <InputField name="documentIssuer" label="Кем выдан" control={control} />
        <InputField
          name="documentCode"
          label={DOCUMENT_MASKS[documentType]?.labelCode || ''}
          control={control}
          mask={DOCUMENT_MASKS[documentType]?.code || ''}
        />
        <DatePickerField name="documentIssueDate" label="Дата выдачи документа" control={control} />
      </div>
    </>
  );
}
