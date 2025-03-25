'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useGroupStore } from '@/store/useStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TravelSheetButton from './components/TravelSheetButton';

const DrivingSchedule = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [updatedSessions, setUpdatedSessions] = useState([]);
  const { group, setGroup } = useGroupStore();
  const { toast } = useToast();

  const students = group?.students || [];
  const startTrainingDate = group?.startTrainingDate || null;
  const endTrainingDate = group?.endTrainingDate || null;

  useEffect(() => {
    async function fetchDataGroup() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/group/${id}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных о группе');

        const data = await response.json();
        setGroup(data);
      } catch (error) {
        toast({ variant: 'destructive', description: `${error.message}` });
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDataGroup();
  }, [id]);

  useEffect(() => {
    if (!group) return;

    const fetchSessions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/driving-sessions?groupId=${group.id}`);
        if (!response.ok) throw new Error('Ошибка загрузки driving sessions');

        const data = await response.json();
        setUpdatedSessions(data);
      } catch (error) {
        toast({ variant: 'destructive', description: 'Ошибка: ' + error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, [group]);

  const handleSaveData = async () => {
    try {
      const response = await fetch(`/api/driving-sessions?groupId=${group.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessions: updatedSessions }),
      });

      if (!response.ok) throw new Error('Ошибка при сохранении данных');

      toast({ variant: 'success', description: 'Данные успешно сохранены!' });
    } catch (error) {
      toast({ variant: 'destructive', description: 'Ошибка: ' + error.message });
    }
  };

  const handleUpdateHours = (studentId, date, newHours) => {
    setUpdatedSessions((prev) => {
      const updated = prev.map((s) => {
        if (s.studentId === studentId && s.date === date) {
          return {
            ...s,
            duration: parseFloat(s.duration) + parseFloat(newHours),
          };
        }
        return s;
      });

      if (!updated.some((s) => s.studentId === studentId && s.date === date)) {
        updated.push({ studentId, date, duration: newHours });
      }

      return updated;
    });
  };

  const generateDates = () => {
    let dates = [];
    let currentDate = new Date(startTrainingDate);
    while (currentDate <= new Date(endTrainingDate)) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const dates = generateDates();

  if (isLoading || !group) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="min-w-full overflow-hidden">
      <Button variant="secondary" onClick={handleSaveData}>
        <Save /> Сохранить данные
      </Button>
      <div className="max-h-screen overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 w-[2rem] bg-white">#</TableHead>
              <TableHead className="sticky left-[2rem] z-10 w-[13rem] bg-white">
                ФИО студента
              </TableHead>
              <TableHead className="sticky left-[15rem] z-10 w-[2rem] bg-white">
                Общее время
              </TableHead>
              {dates.map((date) => {
                const isToday =
                  date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];

                return (
                  <TableHead
                    key={date.toISOString()}
                    className={`-rotate-90 py-2 ${isToday ? 'font-bold text-black' : ''}`}
                  >
                    {format(new Date(date), 'EEE, dd/MM', { locale: ru })}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {students
              .sort((a, b) => a.studentNumber - b.studentNumber)
              .map((student) => {
                const totalHours = updatedSessions
                  .filter((s) => s.studentId === student.id)
                  .reduce((sum, s) => parseFloat(sum) + parseFloat(s.duration || 0), 0);

                return (
                  <TableRow key={student.id}>
                    <TableCell className="sticky left-0 z-10 w-[2rem] bg-white">
                      {student.studentNumber}
                    </TableCell>
                    <TableCell className="sticky left-[2rem] z-10 w-[13rem] bg-white">
                      {student.lastName} {student.firstName}
                    </TableCell>
                    <TableCell className="sticky left-[15rem] z-10 w-[2rem] bg-white">
                      {totalHours} ч
                    </TableCell>
                    {dates.map((date) => {
                      const session = updatedSessions.find(
                        (s) =>
                          s.studentId === student.id &&
                          new Date(s.date).toISOString().split('T')[0] ===
                            date.toISOString().split('T')[0],
                      );

                      return (
                        <TableCell key={date.toISOString()} className="w-16">
                          <Input
                            type="number"
                            min={0}
                            max={2}
                            step={2}
                            value={session?.duration ?? 0}
                            className={session?.duration == null ? 'text-white' : 'text-black'}
                            onChange={(e) =>
                              handleUpdateHours(
                                student.id,
                                date.toISOString().split('T')[0],
                                Number(e.target.value),
                              )
                            }
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="sticky left-0 z-10 w-[17rem] bg-white">
                Распечатать путевой лист
              </TableCell>
              {dates.map((date) => (
                <TableCell key={date.toISOString()}>
                  <TravelSheetButton date={date} group={group} />
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default DrivingSchedule;
