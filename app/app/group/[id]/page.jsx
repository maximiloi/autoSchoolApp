'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';

import StudentList from './components/StudentList';
import FooterPage from './components/FooterPage';

export default function GroupPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);
  const [group, setGroupData] = useState(null);

  const sessionUserCompanyId = useMemo(() => session?.user?.companyId, [session]);

  useEffect(() => {
    if (!id || !sessionUserCompanyId || group) return;

    async function fetchDataGroup() {
      try {
        setLoading(true);
        const [groupResponse, companyResponse] = await Promise.all([
          fetch(`/api/group/${id}`),
          fetch(`/api/company/${sessionUserCompanyId}`),
        ]);

        if (!groupResponse.ok) throw new Error('Ошибка загрузки данных о группе');
        if (!companyResponse.ok) throw new Error('Ошибка загрузки данных о компании');

        setGroupData(await groupResponse.json());
        setCompany(await companyResponse.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDataGroup();
  }, [id, sessionUserCompanyId]);

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
      <StudentList group={group} company={company} />
      <Separator className="my-4" />
      <FooterPage />
    </>
  );
}
