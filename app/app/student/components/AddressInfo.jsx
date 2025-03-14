import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import InputField from '@/components/ui/InputField';

export default function AddressInfo({ control, setSameAddress, sameAddress, setValue, getValues }) {
  const addressFields = [
    'country',
    'addressRegion',
    'city',
    'street',
    'house',
    'building',
    'apartment',
  ];

  const formatField = (field, value) => {
    if (!value) return '';
    if (value.includes('.')) return value;
    const prefixes = {
      addressRegion: (v) => `${v} обл.`,
      city: (v) => `г. ${v}`,
      street: (v) => `ул. ${v}`,
      house: (v) => `д. ${v}`,
      building: (v) => `корп. ${v}`,
      apartment: (v) => `кв. ${v}`,
    };
    return prefixes[field] ? prefixes[field](value) : value;
  };

  const updateRegistrationAddress = () => {
    const addressParts = addressFields
      .map((field) => formatField(field, getValues(field)))
      .filter(Boolean);
    setValue('registrationAddress', addressParts.join(', '));
  };

  useEffect(
    () => {
      updateRegistrationAddress();
    },
    addressFields.map((field) => useWatch({ control, name: field })),
  );

  return (
    <>
      <h4 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Адрес регистрации
      </h4>
      <div className="grid grid-cols-3 gap-4">
        <InputField name="country" label="Страна" control={control} />
        <InputField name="addressRegion" label="Область / Регион / Район" control={control} />
        <InputField name="city" label="Город / Населенный пункт" control={control} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <InputField name="street" label="Улица" control={control} />
        <InputField name="house" label="Дом" control={control} />
        <InputField name="building" label="Корпус" control={control} />
        <InputField name="apartment" label="Квартира" control={control} />
      </div>

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
