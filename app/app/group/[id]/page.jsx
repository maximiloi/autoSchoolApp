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
  const { group, setGroup } = useGroupStore();
  const { loading, error } = useGroupData(id);

  if (loading) return <p>Данные загружаются...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <HeaderPage group={group} setGroup={setGroup} />
      <Separator className="my-4" />
      <StudentList company={company} />
      <Separator className="my-4" />
      <FooterPage group={group} company={company} />
    </>
  );
}
