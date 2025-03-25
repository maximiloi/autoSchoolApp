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
import { Printer } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const DrivingSchedule = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [updatedSessions, setUpdatedSessions] = useState([]);
  const { group, setGroup } = useGroupStore();
  const { toast } = useToast();

  const { students, startTrainingDate, endTrainingDate } = group;

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

  const handleUpdateHours = (studentId, date, newHours) => {
    setUpdatedSessions((prev) =>
      prev.map((s) =>
        s.studentId === studentId && s.date === date ? { ...s, duration: newHours } : s,
      ),
    );
  };

  const handlePrintRouteSheet = (date) => {
    console.log('Печать путевого листа на', date);
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
              {dates.map((date) => (
                <TableHead key={date.toISOString()} className="-rotate-90 py-2">
                  {format(new Date(date), 'EEE, dd/MM', { locale: ru })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {students
              .sort((a, b) => a.studentNumber - b.studentNumber)
              .map((student) => {
                const totalHours = updatedSessions
                  .filter((s) => s.studentId === student.id)
                  .reduce((sum, s) => sum + (s.duration || 0), 0);

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
                          s.studentId === student.id && s.date === date.toISOString().split('T')[0],
                      );

                      return (
                        <TableCell key={date.toISOString()} className="w-16">
                          <Input
                            type="number"
                            min={0}
                            max={2}
                            step={2}
                            value={session?.duration}
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
                  <Button onClick={() => handlePrintRouteSheet(date)}>
                    <Printer />
                  </Button>
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
