'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

import TablePage from './components/TablePage';
import FooterPage from './components/FooterPage';

export default function GroupPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [group, setGroupData] = useState(null);

  useEffect(() => {
    async function fetchDataGroup() {
      try {
        const groupResponse = await fetch(`/api/group/${id}`);
        if (!groupResponse.ok) throw new Error('Ошибка загрузки данных о группе');
        const groupData = await groupResponse.json();

        setGroupData(groupData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDataGroup();
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <>
      <div className="flex gap-8">
        <h2 className="text-sm">
          Группа № <span className="text-lg text-muted-foreground">{group.groupNumber}</span>
        </h2>
        <p className="text-sm">
          Категория: <span className="text-lg text-muted-foreground">{group.category}</span>
        </p>
        <p className="text-sm">
          Начало обучения:{' '}
          <span className="text-lg text-muted-foreground">
            {format(group.startTrainingDate, 'PPP', { locale: ru })}
          </span>
        </p>
        <p className="text-sm">
          Конец обучения:{' '}
          <span className="text-lg text-muted-foreground">
            {format(group.endTrainingDate, 'PPP', { locale: ru })}
          </span>
        </p>
      </div>
      <Separator className="my-4" />
      <TablePage group={group} />
      <Separator className="my-4" />
      <FooterPage />
    </>
  );
}
