'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RussianRuble } from 'lucide-react';

import { useCompanyStore, useGroupStore } from '@/store/useStore';

import StudentList from './components/StudentList';
import FooterPage from './components/FooterPage';

export default function GroupPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { company } = useCompanyStore();
  const { group, setGroup } = useGroupStore();

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

  return (
    <>
      <div className="flex gap-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className={`w-10 rounded-full text-white ${totalDue > 0 ? 'bg-red-600' : 'bg-green-600'}`}
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
              <span className="font-semibold text-green-600">{totalPaid.toLocaleString()} ₽</span>
            </p>
            <p>
              Остаток к оплате:{' '}
              <span className="font-semibold text-red-600">{totalDue.toLocaleString()} ₽</span>
            </p>
          </DialogContent>
        </Dialog>
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
      <FooterPage group={group} company={company} />
    </>
  );
}
