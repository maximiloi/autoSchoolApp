import { Checkbox } from '@/components/ui/checkbox';
import InputField from '@/components/ui/InputField';

export default function AddressInfo({ control, setSameAddress, sameAddress }) {
  return (
    <>
      <h4 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Адрес регистрации
      </h4>
      <InputField name="registrationAddress" label="Адрес регистрации" control={control} />
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
      <InputField name="actualAddress" label="Фактический адрес" control={control} />
    </>
  );
}
