import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

export function useActiveGroups(student, reset, setValue, watch) {
  const [activeGroups, setActiveGroups] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const selectedGroupId = watch('group');

  const fetchActiveGroups = useCallback(async () => {
    if (status !== 'authenticated') return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/group/`);
      if (!response.ok) throw new Error('Ошибка загрузки активных групп');

      const data = await response.json();
      const activeGroups = data.filter((group) => group.isActive);
      setActiveGroups(activeGroups);
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Ошибка',
        description: `Не удалось загрузить группы. ${error.message}`,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [status, student, toast]);

  useEffect(() => {
    fetchActiveGroups();
  }, [fetchActiveGroups]);

  useEffect(() => {
    if (!activeGroups) return;

    const selectedGroup = activeGroups.find((group) => group.id === selectedGroupId);
    if (selectedGroup && !student) {
      setValue('studentNumber', String(selectedGroup.students.length + 1));
    }
  }, [selectedGroupId, activeGroups, student, setValue]);

  return { activeGroups, loading, error };
}
