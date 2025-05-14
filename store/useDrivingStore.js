import { create } from 'zustand';
import { useGroupStore } from './useStore';

export const useDrivingStore = create((set, get) => ({
  sessions: [],
  isLoading: false,
  isSaving: false,

  fetchDrivingData: async (groupId) => {
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

      const normalizedSessions = sessionsData.map((s) => ({
        ...s,
        date: new Date(s.date),
      }));

      const { setGroup } = useGroupStore.getState();
      setGroup(groupData);

      set({ sessions: normalizedSessions });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateSlot: (studentId, dateStr, selectedSlot) => {
    const currentSessions = get().sessions;
    const date = new Date(dateStr);

    if (!selectedSlot || selectedSlot === '__clear__') {
      const cleaned = currentSessions.filter(
        (s) => !(s.studentId === studentId && s.date.toISOString().split('T')[0] === dateStr),
      );
      set({ sessions: cleaned });
      return;
    }

    const newSessions = currentSessions.filter(
      (s) =>
        !(
          s.date.toISOString().split('T')[0] === dateStr &&
          s.slot === selectedSlot &&
          s.studentId !== studentId
        ),
    );

    const existingIndex = newSessions.findIndex(
      (s) =>
        s.studentId === studentId &&
        s.date.toISOString().split('T')[0] === dateStr &&
        s.slot === selectedSlot,
    );

    if (existingIndex !== -1) {
      newSessions.splice(existingIndex, 1);
    } else {
      newSessions.push({ studentId, date, slot: selectedSlot });
    }

    set({ sessions: [...newSessions] });
  },

  saveSessions: async (groupId) => {
    set({ isSaving: true });
    try {
      const payload = get().sessions.map((s) => ({
        ...s,
        date: s.date.toISOString(),
      }));

      const response = await fetch(`/api/driving-sessions?groupId=${groupId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessions: payload }),
      });

      if (!response.ok) throw new Error('Ошибка при сохранении данных');
    } finally {
      set({ isSaving: false });
    }
  },
}));
