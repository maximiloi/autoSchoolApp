'use client';

import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Pencil, RussianRuble } from 'lucide-react';

import { useCompanyStore, useGroupStore } from '@/store/useStore';

import EditGroupForm from '../components/EditGroupForm';
import ArchivingSwitch from './components/ArchivingSwitch';
import FooterPage from './components/FooterPage';
import StudentList from './components/StudentList';

export default function GroupPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { company } = useCompanyStore();
  const { group, setGroup } = useGroupStore();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchDataGroup() {
      try {
        setLoading(true);
        const response = await fetch(`/api/group/${id}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных о группе');

        const data = await response.json();
        setGroup(data);
      } catch (err) {
        toast({ variant: 'destructive', description: `${error.message}` });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDataGroup();
  }, [id]);

  if (!group) return <p>Данные загружаются...</p>;
  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const totalCost = group.students.reduce((sum, student) => sum + Number(student.trainingCost), 0);
  const totalPaid = group.students.reduce(
    (sum, student) => sum + student.payments.reduce((pSum, p) => pSum + Number(p.amount), 0),
    0,
  );
  const totalDue = totalCost - totalPaid;
  const endDate = new Date(group.endTrainingDate);
  const now = new Date();
  const userRole = session?.user?.role || 'USER';

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {userRole.toUpperCase() === 'DIRECTOR' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className={`w-10 rounded-full text-white ${totalDue > 0 ? 'bg-red-200 hover:bg-red-300' : 'bg-green-200 hover:bg-green-300'}`}
                >
                  <RussianRuble />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Финансовая информация</DialogTitle>
                <DialogDescription>Группа № {group.groupNumber}</DialogDescription>
                <p>
                  Общая стоимость обучения:{' '}
                  <span className="font-semibold">{totalCost.toLocaleString()} ₽</span>
                </p>
                <p>
                  Оплачено:{' '}
                  <span className="font-semibold text-green-600">
                    {totalPaid.toLocaleString()} ₽
                  </span>
                </p>
                <p>
                  Остаток к оплате:{' '}
                  <span className="font-semibold text-red-600">{totalDue.toLocaleString()} ₽</span>
                </p>
              </DialogContent>
            </Dialog>
          )}
          <h2 className="text-sm">
            Группа № <span className="text-lg text-muted-foreground">{group.groupNumber}</span>
          </h2>
          <p className="text-sm">
            Категория: <span className="text-lg text-muted-foreground">{group.category}</span>
          </p>
          {userRole.toUpperCase() === 'DIRECTOR' && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-10 rounded-full bg-blue-200 text-white hover:bg-blue-300">
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogTitle>Редактировать группу</DialogTitle>
                <DialogDescription>
                  Обновите информацию о группе № {group.groupNumber}
                </DialogDescription>
                <EditGroupForm
                  group={group}
                  onSuccess={(updatedGroup) => {
                    setGroup(updatedGroup);
                    setOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          )}
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
        {userRole.toUpperCase() === 'DIRECTOR' && (endDate < now || !group.isActive) && (
          <ArchivingSwitch field={group.isActive} />
        )}
      </div>
      <Separator className="my-4" />
      <StudentList company={company} />
      <Separator className="my-4" />
      <FooterPage group={group} company={company} />
    </>
  );
}
