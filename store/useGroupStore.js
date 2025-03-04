import { create } from 'zustand';

const useGroupStore = create((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
}));

export default useGroupStore;
