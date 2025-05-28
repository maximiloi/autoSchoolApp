// DrivingScheduleOptimized.jsx
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
import { useDrivingStore } from '@/store/useDrivingStore';
import { useCompanyStore, useGroupStore } from '@/store/useStore';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { memo, useEffect, useMemo } from 'react';
import TravelSheetButton from './components/TravelSheetButton';

const timeSlots = ['8-10', '10-12', '13-15', '15-17', '17-19', '19-21'];

const normalizeDate = (date) => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

const DrivingSlotCell = memo(({ studentId, date, session, updateSlot, sessions }) => {
  const formattedDate = normalizeDate(date);
  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return (
    <TableCell className={`w-20 ${isWeekend ? 'bg-gray-200' : ''}`}>
      <Select
        value={session?.slot || ''}
        onValueChange={(value) => {
          if (value === '__clear__') {
            updateSlot(studentId, formattedDate, null);
          } else {
            updateSlot(studentId, formattedDate, value);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((slot) => (
            <SelectItem
              key={slot}
              value={slot}
              disabled={sessions.some(
                (s) =>
                  s.slot === slot &&
                  normalizeDate(s.date) === formattedDate &&
                  s.studentId !== studentId,
              )}
            >
              {slot}
            </SelectItem>
          ))}
          {session && <SelectItem value="__clear__">Очистить</SelectItem>}
        </SelectContent>
      </Select>
    </TableCell>
  );
});

const StudentRow = memo(({ student, dates, sessionMap, sessions, updateSlot }) => {
  const studentId = student.id;
  const totalHours = sessions.filter((s) => s.studentId === studentId).length * 2;

  return (
    <TableRow key={studentId}>
      <TableCell className="sticky left-0 z-10 bg-white">{student.studentNumber}</TableCell>
      <TableCell className="sticky left-[2rem] z-10 bg-white">
        {student.lastName} {student.firstName}
      </TableCell>
      <TableCell className="sticky left-[15rem] z-10 bg-white">{totalHours} ч</TableCell>
      {dates.map((date) => {
        const formattedDate = normalizeDate(date);
        const session = sessionMap.get(`${studentId}_${formattedDate}`);

        return (
          <DrivingSlotCell
            key={formattedDate + '-' + studentId}
            studentId={studentId}
            date={date}
            session={session}
            updateSlot={updateSlot}
            sessions={sessions}
          />
        );
      })}
    </TableRow>
  );
});

const DrivingSchedule = () => {
  const { id } = useParams();
  const { group, setGroup } = useGroupStore();
  const { company } = useCompanyStore();
  const { toast } = useToast();
  const { sessions, isLoading, isSaving, fetchDrivingData, updateSlot, saveSessions } =
    useDrivingStore();

  useEffect(() => {
    fetchDrivingData(id).catch((error) =>
      toast({ variant: 'destructive', description: error.message }),
    );
  }, [id]);

  const students = group?.students || [];
  const startTrainingDate = group?.startTrainingDate ? new Date(group.startTrainingDate) : null;
  const endTrainingDate = group?.endTrainingDate ? new Date(group.endTrainingDate) : null;

  const dates = useMemo(() => {
    if (!startTrainingDate || !endTrainingDate) return [];
    const result = [];
    let current = new Date(startTrainingDate);
    while (current <= endTrainingDate) {
      result.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return result;
  }, [startTrainingDate, endTrainingDate]);

  const sessionMap = useMemo(() => {
    const map = new Map();
    for (const s of sessions) {
      map.set(`${s.studentId}_${normalizeDate(s.date)}`, s);
    }
    return map;
  }, [sessions]);

  const daysSessionsMap = useMemo(() => {
    const map = {};
    dates.forEach((date) => {
      const key = normalizeDate(date);
      const daySessions = sessions
        .filter((s) => normalizeDate(s.date) === key)
        .map((s) => {
          const student = students.find((stu) => stu.id === s.studentId);
          return student
            ? {
                firstName: student.firstName,
                lastName: student.lastName,
                phone: student.phone,
                slot: s.slot,
              }
            : null;
        })
        .filter(Boolean);
      map[key] = daySessions;
    });
    return map;
  }, [sessions, dates, students]);

  const handleSave = async () => {
    try {
      await saveSessions(group.id);
      fetchDrivingData(group.id);
      toast({ variant: 'success', description: 'Данные успешно сохранены!' });
    } catch (error) {
      toast({ variant: 'destructive', description: error.message });
    }
  };

  if (isLoading || !group) return <div>Загрузка...</div>;

  return (
    <div className="min-w-full overflow-hidden">
      <div className="mb-8 flex items-center justify-between">
        <h1>Учет вождения: группы № {group.groupNumber}</h1>
        <Button variant="secondary" onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Сохранение...' : 'Сохранить данные'}
        </Button>
      </div>

      <div className="max-h-screen overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 w-[2rem] bg-white">#</TableHead>
              <TableHead className="sticky left-[2rem] z-10 w-[13rem] bg-white">ФИО</TableHead>
              <TableHead className="sticky left-[15rem] z-10 w-[2rem] bg-white">Часы</TableHead>
              {dates.map((date) => {
                const isToday = normalizeDate(date) === normalizeDate(new Date());
                const dayOfWeek = date.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                return (
                  <TableHead
                    key={date.toISOString()}
                    className={`py-2 ${isToday ? 'font-bold text-black' : ''} ${isWeekend ? 'bg-gray-300' : ''}`}
                  >
                    {format(date, 'EEE, dd/MM', { locale: ru })}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {students
              .sort((a, b) => a.studentNumber - b.studentNumber)
              .map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  dates={dates}
                  sessionMap={sessionMap}
                  sessions={sessions}
                  updateSlot={updateSlot}
                />
              ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="sticky left-0 z-10 w-[17rem] bg-white">
                Печать путевых листов
              </TableCell>
              {dates.map((date) => (
                <TableCell key={date.toISOString()}>
                  <TravelSheetButton
                    date={date}
                    group={group}
                    company={company}
                    daySessions={daysSessionsMap[normalizeDate(date)]}
                  />
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
