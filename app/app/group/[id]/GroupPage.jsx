'use client';

import { useParams } from 'next/navigation';

import { useGroupData } from '@/hooks/useGroupData';

import { Separator } from '@/components/ui/separator';

import { useCompanyStore, useGroupStore } from '@/store/useStore';

import FooterPage from './components/FooterPage';
import HeaderPage from './components/HeaderPage';
import StudentList from './components/StudentList';

export default function GroupPage() {
  const { id } = useParams();
  const { company } = useCompanyStore();
  const { group } = useGroupStore();
  const { loading, error } = useGroupData(id);

  if (!id) return <p>Группа не найдена.</p>;
  if (loading) return <p>Данные загружаются...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <HeaderPage />
      <Separator className="my-4" />
      <StudentList />
      <Separator className="my-4" />
      <FooterPage group={group} company={company} />
    </>
  );
}
