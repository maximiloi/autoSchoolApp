import { create } from 'zustand';

function normalizeDrivingSessions(data) {
  const normalized = {};

  for (const session of data) {
    const dateKey = session.date.slice(0, 10); // 'YYYY-MM-DD'

    if (!normalized[session.studentId]) {
      normalized[session.studentId] = {};
    }

    normalized[session.studentId][dateKey] = session.slot;
  }

  return normalized;
}

function denormalizeSessions(sessions) {
  const result = [];

  for (const [studentId, dates] of Object.entries(sessions)) {
    for (const [date, slot] of Object.entries(dates)) {
      result.push({ studentId, date, slot });
    }
  }

  return result;
}

export const useDrivingStore = create((set, get) => ({
  sessions: [],
  isLoading: false,
  isSaving: false,

  fetchDrivingData: async (groupId, setGroup) => {
    set({ isLoading: true });
    try {
      const [groupRes, sessionsRes] = await Promise.all([
        fetch(`/api/group/${groupId}`),
        fetch(`/api/driving-sessions?groupId=${groupId}`),
      ]);

      if (!groupRes.ok) throw new Error('Ошибка загрузки данных о группе');
      if (!sessionsRes.ok) throw new Error('Ошибка загрузки driving sessions');

      const groupData = await groupRes.json();
      const sessionsData = await sessionsRes.json();

      setGroup(groupData);
      const formatted = normalizeDrivingSessions(sessionsData);
      set({ sessions: formatted });
    } catch (error) {
      console.log('Ошибка получения данных', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  saveSessions: async () => {
    set({ isSaving: true });
    try {
      const sessions = get().sessions;
      const payload = denormalizeSessions(sessions).filter((session) => session.slot !== '-');
      const response = await fetch(`/api/driving-sessions/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessions: payload }),
      });
      if (!response.ok) throw new Error('Ошибка при сохранении данных');
      return { success: true, message: 'Занятия успешно сохранены' };
    } catch (error) {
      return { error: error.message };
    } finally {
      set({ isSaving: false });
    }
  },

  updateSlot: async (studentId, date, status) => {
    if (status === '-') {
      try {
        const response = await fetch('/api/driving-sessions/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, date }),
        });
        if (!response.ok) throw new Error('Ошибка при удалении занятия');
      } catch (error) {
        return { error: error.message };
      }
    }
    set((state) => ({
      sessions: {
        ...state.sessions,
        [studentId]: {
          ...state.sessions[studentId],
          [date]: status,
        },
      },
    }));
    return { error: null };
  },

  getDaySessions: (dateKey, group) => {
    const { sessions } = get();
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
  },
}));
