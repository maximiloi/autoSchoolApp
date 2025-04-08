'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const timeSlots = ['8-10', '10-12', '13-15', '15-17'];

const DrivingSchedule = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [updatedSessions, setUpdatedSessions] = useState([]);
  const { group, setGroup } = useGroupStore();
  const isGroupLoaded = !!group?.id;
  const { toast } = useToast();

  const students = group?.students || [];
  const startTrainingDate = group?.startTrainingDate || null;
  const endTrainingDate = group?.endTrainingDate || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [groupRes, sessionsRes] = await Promise.all([
          fetch(`/api/group/${id}`),
          fetch(`/api/driving-sessions?groupId=${id}`),
        ]);

        if (!groupRes.ok) throw new Error('Ошибка загрузки данных о группе');
        if (!sessionsRes.ok) throw new Error('Ошибка загрузки driving sessions');

        const groupData = await groupRes.json();
        const sessionsData = await sessionsRes.json();

        setGroup(groupData);
        setUpdatedSessions(sessionsData);
      } catch (error) {
        toast({ variant: 'destructive', description: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      toast({ variant: 'destructive', description: error.message });
    }
  };

  const handleUpdateSlot = (studentId, date, selectedSlot) => {
    setUpdatedSessions((prev) => {
      const newSessions = prev.filter(
        (s) =>
          !(
            new Date(s.date).toISOString().split('T')[0] === date &&
            s.slot === selectedSlot &&
            s.studentId !== studentId
          ),
      );

      const existingIndex = newSessions.findIndex(
        (s) =>
          s.studentId === studentId &&
          new Date(s.date).toISOString().split('T')[0] === date &&
          s.slot === selectedSlot,
      );

      if (existingIndex !== -1) {
        newSessions.splice(existingIndex, 1);
      } else {
        newSessions.push({ studentId, date, slot: selectedSlot });
      }

      return [...newSessions];
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
                    className={`py-2 ${isToday ? 'font-bold text-black' : ''}`}
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
                const totalHours =
                  updatedSessions.filter((s) => s.studentId === student.id).length * 2;

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
                      const formattedDate = date.toISOString().split('T')[0];
                      const session = updatedSessions.find(
                        (s) =>
                          s.studentId === student.id &&
                          new Date(s.date).toISOString().split('T')[0] === formattedDate,
                      );

                      return (
                        <TableCell key={date.toISOString()} className="w-20">
                          <Select
                            value={session?.slot || ''}
                            onValueChange={(value) =>
                              handleUpdateSlot(student.id, formattedDate, value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem
                                  key={slot}
                                  value={slot}
                                  disabled={updatedSessions.some(
                                    (s) =>
                                      s.slot === slot &&
                                      new Date(s.date).toISOString().split('T')[0] ===
                                        formattedDate &&
                                      s.studentId !== student.id,
                                  )}
                                >
                                  {slot}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
