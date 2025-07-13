import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { memo, useCallback } from 'react';

const SaveButton = ({ saveSessions, toast, isSaving, setIsSaving }) => {
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const result = await saveSessions();
      toast({
        variant: result.error ? 'destructive' : 'success',
        description: result.error || result.message,
      });
    } finally {
      setIsSaving(false);
    }
  }, [saveSessions, toast, setIsSaving]);

  return (
    <Button onClick={handleSave} disabled={isSaving}>
      <Save /> {isSaving ? 'Сохранение...' : 'Сохранить занятия'}
    </Button>
  );
};

export default memo(SaveButton);
