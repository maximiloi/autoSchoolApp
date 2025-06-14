import { useState } from 'react';

import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// add var company
const timeSlots = ['8-10', '10-12', '13-15', '15-17', '17-19', '19-21', '-'];

export default function CellPicker({ value, onSelect, disabledSlots = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="h-10 w-14 rounded border text-xs hover:bg-muted">{value || '-'}</button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <Command>
          <CommandList>
            <CommandGroup heading="Выбрать промежуток времени">
              {timeSlots.map((slot) => (
                <CommandItem
                  key={slot}
                  value={slot}
                  disabled={disabledSlots.includes(slot)}
                  onSelect={() => {
                    onSelect(slot);
                    setOpen(false);
                  }}
                >
                  {slot}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
