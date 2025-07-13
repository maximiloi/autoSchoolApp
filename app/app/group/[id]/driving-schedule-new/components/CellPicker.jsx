// app/app/group/[id]/driving-schedule-new/components/CellPicker.jsx
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { memo, useState } from 'react';

export const TIME_SLOTS = ['8-10', '10-12', '13-15', '15-17', '17-19', '19-21', '-'];

function CellPicker({ value, onSelect, takenSlots = [] }) {
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
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <button
                className={`h-10 w-14 rounded border text-xs hover:bg-muted ${takenSlots.includes(value) && value !== '-' ? 'bg-yellow-100' : ''}`}
                disabled={isUpdating}
              >
                {isUpdating ? '...' : value || '-'}
              </button>
            </PopoverTrigger>
          </TooltipTrigger>
          {takenSlots.includes(value) && value !== '-' && (
            <TooltipContent>Этот слот уже занят другим студентом</TooltipContent>
          )}
        </Tooltip>
        <PopoverContent className="w-40 p-0">
          <Command>
            <CommandList>
              <CommandGroup heading="Выбрать промежуток времени">
                {TIME_SLOTS.map((slot) => (
                  <CommandItem
                    key={slot}
                    value={slot}
                    disabled={isUpdating}
                    onSelect={() => handleSelect(slot)}
                    className={takenSlots.includes(slot) && slot !== '-' ? 'bg-yellow-50' : ''}
                  >
                    {slot}
                    {takenSlots.includes(slot) && slot !== '-' && ' (занят)'}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}

export default memo(CellPicker);
