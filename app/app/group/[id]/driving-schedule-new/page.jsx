'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Save } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const [fetchError, setFetchError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const scrollRef = useRef(null);
  const { id } = useParams();
  const { toast } = useToast();
  const { group, setGroup } = useGroupStore();
  const { fetchDrivingData, updateSlot, getDaySessions, saveSessions } = useDrivingStore();
  const sessions = useDrivingStore((state) => state.sessions);
  const isLoading = useDrivingStore((state) => state.isLoading);

  const dates = useMemo(() => {
    if (!group) return [];
    const startDate = new Date(group.startTrainingDate);
    const endDate = new Date(group.endTrainingDate);
    return getDatesInRange(startDate, endDate);
  }, [group]);

  useEffect(() => {
    setFetchError(null);
    fetchDrivingData(id, setGroup).catch((error) => {
      setFetchError(error.message);
      toast({ variant: 'destructive', description: error.message });
    });
  }, [id]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -890, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 890, behavior: 'smooth' });
    }
  };

  const calculateTotalHours = useCallback(
    (studentId) => {
      const entries = sessions[studentId] || {};
      return Object.values(entries).filter((slot) => slot !== '-').length * 2;
    },
    [sessions],
  );

  const handleSelect = useCallback(
    (studentId, dateKey) => async (slot) => {
      if (isSaving) return;
      const result = await updateSlot(studentId, dateKey, slot);
      if (result.error) {
        toast({ variant: 'destructive', description: result.error });
      }
    },
    [updateSlot, toast, isSaving],
  );

  const memoizedGetDaySessions = useCallback(
    (date) => getDaySessions(date, group),
    [getDaySessions, group],
  );

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveSessions();
    setIsSaving(false);
    if (result.error) {
      toast({ variant: 'destructive', description: result.error });
    } else {
      toast({ variant: 'success', description: result.message });
    }
  };

  if (fetchError) return <div className="text-red-500">Ошибка: {fetchError}</div>;
  if (isLoading || !group) return <div>Загрузка...</div>;

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
        <Button className="mt-4" onClick={handleSave} disabled={isSaving}>
          <Save /> {isSaving ? 'Сохранение...' : 'Сохранить занятия'}
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
                            onSelect={handleSelect(student.id, dateKey)}
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
                        getDaySessions={memoizedGetDaySessions}
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
