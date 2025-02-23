import { IMaskInput } from 'react-imask';
import { FormControl, FormField, FormItem, FormMessage } from './form';
import { Input } from './input';

export default function InputField({ name, label, control, mask }) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            {mask ? (
              <IMaskInput
                {...field}
                mask={mask}
                placeholder={label}
                value={field.value || ''}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                onAccept={(value) => field.onChange(value)}
              />
            ) : (
              <Input placeholder={label} {...field} value={field.value || ''} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
