'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@/hooks/use-toast';

import { useDrivingStore } from '@/store/useDrivingStore';
import { useGroupStore } from '@/store/useStore';

import { Button } from '@/components/ui/button';
import CellPicker from './components/CellPicker';
import TravelSheetButton from './components/TravelSheetButton';

function getDatesInRange(start, end) {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export default function DrivingScheduleNEW() {
  const scrollRef = useRef(null);
  const { id } = useParams();
  const { toast } = useToast();
  const [sessions, setSessions] = useState({});
  const { group } = useGroupStore();
  const { sessions: fetchSessions, isLoading, fetchDrivingData } = useDrivingStore();

  useEffect(() => {
    fetchDrivingData(id).catch((error) =>
      toast({ variant: 'destructive', description: error.message }),
    );
  }, [id]);

  useEffect(() => {
    setSessions(normalizeDrivingSessions(fetchSessions));
  }, [fetchSessions]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -500, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 500, behavior: 'smooth' });
    }
  };

  const updateSlot = async (studentId, date, status) => {
    if (status === '-') {
      try {
        await fetch('/api/driving-sessions/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, date }),
        });
      } catch (error) {
        toast({ variant: 'destructive', description: `Ошибка при удалении слота ${error}` });
      }

      setSessions((prev) => {
        const updated = { ...prev };
        if (updated[studentId]) {
          delete updated[studentId][date];
          if (Object.keys(updated[studentId]).length === 0) {
            delete updated[studentId];
          }
        }
        return updated;
      });
    } else {
      setSessions((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [date]: status,
        },
      }));
    }
  };

  const calculateTotalHours = (studentId) => {
    const entries = sessions[studentId] || {};
    return Object.values(entries).filter((slot) => slot !== '-').length * 2;
  };

  const getDaySessions = (dateKey) => {
    return Object.entries(sessions).reduce((acc, [studentId, slots]) => {
      if (slots[dateKey] && slots[dateKey] !== '-') {
        const student = group.students.find((s) => s.id === studentId);
        if (student) {
          acc.push({
            firstName: student.firstName,
            lastName: student.lastName,
            phone: student.phone,
            slot: slots[dateKey],
          });
        }
      }
      return acc;
    }, []);
  };

  const normalizeDrivingSessions = (drivingSessions) => {
    const result = {};

    for (const session of drivingSessions) {
      const dateKey = format(new Date(session.date), 'yyyy-MM-dd');

      if (!result[session.studentId]) {
        result[session.studentId] = {};
      }

      result[session.studentId][dateKey] = session.slot;
    }

    return result;
  };

  const getChangedSessions = () => {
    const original = normalizeDrivingSessions(fetchSessions);
    const changed = [];

    for (const studentId in sessions) {
      const currentDates = sessions[studentId];
      const originalDates = original[studentId] || {};

      for (const date in currentDates) {
        if (currentDates[date] !== originalDates[date]) {
          changed.push({
            studentId,
            date,
            slot: currentDates[date],
          });
        }
      }
    }

    return changed;
  };

  const saveSessions = useCallback(async () => {
    const changes = getChangedSessions();

    if (changes.length === 0) {
      toast({ variant: 'default', description: 'Нет изменений для сохранения' });
      return;
    }

    try {
      await fetch('/api/driving-sessions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessions: changes }),
      });
      toast({ variant: 'success', description: 'Изменения сохранены!' });
    } catch (error) {
      toast({ variant: 'destructive', description: `Ошибка при сохранении: ${error.message}` });
      throw error;
    }
  }, [sessions, fetchSessions]);

  if (isLoading || !group) return <div>Загрузка...</div>;

  const startDate = new Date(group.startTrainingDate);
  const endDate = new Date(group.endTrainingDate);
  const dates = getDatesInRange(startDate, endDate);

  return (
    <div className="p-4">
      <h1>Учет вождения: группы № {group.groupNumber}</h1>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="mb-2 mt-2 flex gap-2">
          <button onClick={scrollLeft} className="rounded bg-muted px-2 py-1">
            ←
          </button>
          <button onClick={scrollRight} className="rounded bg-muted px-2 py-1">
            →
          </button>
        </div>
        <Button className="mt-4" onClick={saveSessions}>
          <Save /> Сохранить занятия
        </Button>
      </div>

      <div ref={scrollRef} className="w-full overflow-x-auto">
        <div className="min-w-[1500px]">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-2 text-left">Студент</th>
                {dates.map((date) => (
                  <th
                    key={date.toISOString()}
                    className={`p-1 text-xs text-gray-500 ${[0, 6].includes(date.getDay()) ? 'bg-red-50 text-red-500' : ''}`}
                  >
                    {format(date, 'EEE, dd/MM', { locale: ru })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.students
                .sort((a, b) => a.studentNumber - b.studentNumber)
                .map((student) => (
                  <tr key={student.id}>
                    <td className="sticky left-0 z-10 flex justify-between whitespace-nowrap bg-white p-2 font-medium">
                      <span>
                        {student.studentNumber}. {student.lastName} {student.firstName}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({calculateTotalHours(student.id)} ч.)
                      </span>
                    </td>
                    {dates.map((date) => {
                      const dateKey = format(date, 'yyyy-MM-dd');
                      const current = sessions[student.id]?.[dateKey] || '';
                      const slotsTaken = Object.entries(sessions)
                        .filter(([id]) => id !== student.id)
                        .map(([, byDate]) => byDate?.[dateKey])
                        .filter(Boolean);

                      return (
                        <td
                          key={dateKey}
                          className={`p-1 ${[0, 6].includes(date.getDay()) ? 'bg-red-50' : ''}`}
                        >
                          <CellPicker
                            value={current}
                            onSelect={(slot) => updateSlot(student.id, dateKey, slot)}
                            disabledSlots={slotsTaken}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              <tr>
                <td className="sticky left-0 bg-white p-2 text-right text-sm font-medium">
                  Печать путевого листа
                </td>
                {dates.map((date) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  return (
                    <td key={dateKey} className="p-1 text-center">
                      <TravelSheetButton
                        date={dateKey}
                        group={group}
                        getDaySessions={getDaySessions}
                        saveSessions={saveSessions}
                      />
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
