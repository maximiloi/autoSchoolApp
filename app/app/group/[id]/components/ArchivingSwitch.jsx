'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useGroupStore } from '@/store/useStore';
import { useState } from 'react';

function ArchivingSwitch({ field }) {
  const { group, setGroup } = useGroupStore();
  const { toast } = useToast();
  const [isArchived, setIsArchived] = useState(group.isActive);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = async (value) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/group/${group.id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: value }),
      });

      if (!response.ok) throw new Error('Не удалось обновить статус группы');

      const updated = await response.json();
      setGroup(updated);
      setIsArchived(updated.isActive);
      toast({ description: 'Статус группы обновлён' });
    } catch (err) {
      toast({ variant: 'destructive', description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Label className="flex items-center gap-4">
      <Switch checked={isArchived} disabled={isSaving} onCheckedChange={handleToggle} />
      Активная группа
    </Label>
  );
}

export default ArchivingSwitch;
