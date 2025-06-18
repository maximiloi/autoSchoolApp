import { useEffect, useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { useGroupStore } from '@/store/useStore';

export const useGroupData = (id) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { setGroup } = useGroupStore();

  useEffect(() => {
    if (!id) return;

    const fetchGroup = async () => {
      try {
        const res = await fetch(`/api/group/${id}`);
        if (!res.ok) throw new Error('Ошибка загрузки данных о группе');
        const data = await res.json();
        setGroup(data);
      } catch (err) {
        toast({ variant: 'destructive', description: err.message });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);

  return { loading, error };
};
