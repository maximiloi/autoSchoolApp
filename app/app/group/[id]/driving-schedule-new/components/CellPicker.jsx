import { memo, useState } from 'react';

import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// add var company
export const TIME_SLOTS = ['8-10', '10-12', '13-15', '15-17', '17-19', '19-21', '-'];

function CellPicker({ value, onSelect, disabledSlots = [] }) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelect = async (slot) => {
    setIsUpdating(true);
    try {
      await onSelect(slot);
      setOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="h-10 w-14 rounded border text-xs hover:bg-muted" disabled={isUpdating}>
          {isUpdating ? '...' : value || '-'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <Command>
          <CommandList>
            <CommandGroup heading="Выбрать промежуток времени">
              {TIME_SLOTS.map((slot) => (
                <CommandItem
                  key={slot}
                  value={slot}
                  disabled={disabledSlots.includes(slot) || isUpdating}
                  onSelect={() => handleSelect(slot)}
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

export default memo(CellPicker);
