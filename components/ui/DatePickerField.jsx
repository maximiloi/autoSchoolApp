import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarCustom } from '@/components/ui/calendarCustom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import learningStartDate from '@/lib/learningStartDate';

export default function DatePickerField({ name, label, control }) {
  const currentDate = new Date();
  const startYear = currentDate.getFullYear() - 16;
  const startMonth = new Date(startYear, currentDate.getMonth());

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn('w-full pl-3 text-left', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? format(field.value, 'PPP', { locale: ru }) : label}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarCustom
                captionLayout="dropdown-buttons"
                fromYear={1960}
                toYear={2030}
                locale={ru}
                mode="single"
                selected={field.value || null}
                onSelect={field.onChange}
                defaultMonth={name === 'birthDate' ? startMonth : new Date()}
                startMonth={name === 'birthDate' ? startMonth : new Date()}
                disabled={(date) =>
                  name === 'birthDate' ? date > learningStartDate() : date > new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
