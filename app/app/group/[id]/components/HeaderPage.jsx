'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Pencil, RussianRuble } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useGroupStore } from '@/store/useStore';

import EditGroupForm from '../../../create/group/components/EditGroupForm';
import ArchivingSwitch from './ArchivingSwitch';

export default function HeaderPage() {
  const { data: session } = useSession();
  const { group, setGroup } = useGroupStore();
  const [open, setOpen] = useState(false);

  const isDirector = useMemo(
    () => (session?.user?.role?.toUpperCase?.() ?? '') === 'DIRECTOR',
    [session],
  );

  const { totalCost, totalPaid } = useMemo(() => {
    return group?.students.reduce(
      (acc, student) => {
        acc.totalCost += Number(student.trainingCost);
        acc.totalPaid += student.payments.reduce((sum, p) => sum + Number(p.amount), 0);
        return acc;
      },
      { totalCost: 0, totalPaid: 0 },
    );
  }, [group?.students]);

  const totalDue = totalCost - totalPaid;
  const endDate = useMemo(() => new Date(group.endTrainingDate), [group.endTrainingDate]);
  const isArchived = useMemo(
    () => endDate < new Date() || !group.isActive,
    [endDate, group.isActive],
  );

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-8">
        {isDirector && (
          <div className="flex items-center gap-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className={`h-8 w-8 rounded-full text-white ${totalDue > 0 ? 'bg-red-200 hover:bg-red-300' : 'bg-green-200 hover:bg-green-300'}`}
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

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="h-8 w-8 rounded-full bg-blue-200 text-white hover:bg-blue-300">
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
          </div>
        )}
        <div className="">
          <div className="flex items-center gap-8">
            <h2 className="text-sm">
              Группа № <span className="text-lg text-muted-foreground">{group.groupNumber}</span>
            </h2>

            <p className="text-sm">
              Начало лекций:{' '}
              <span className="text-lg text-muted-foreground">{group.lessonStartTime}</span>
            </p>

            <p className="text-sm">
              Категория: <span className="text-lg text-muted-foreground">{group.category}</span>
            </p>
          </div>
          <div className="flex items-center gap-8">
            <p className="text-sm">
              Начало обучения:{' '}
              <span className="text-lg text-muted-foreground">
                {format(new Date(group.startTrainingDate), 'PPP', { locale: ru })}
              </span>
            </p>

            <p className="text-sm">
              Конец обучения:{' '}
              <span className="text-lg text-muted-foreground">
                {format(endDate, 'PPP', { locale: ru })}
              </span>
            </p>
          </div>
        </div>
      </div>
      {isDirector && isArchived && <ArchivingSwitch field={group.isActive} />}
    </div>
  );
}
