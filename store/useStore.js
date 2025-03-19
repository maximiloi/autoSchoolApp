import { create } from 'zustand';

const useCompanyStore = create((set) => ({
  company: {},

  setCompany: (company) => set({ company }),

  reset: () => set({ company: {} }),
}));

const useGroupStore = create((set) => ({
  groups: [],
  group: null,

  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),

  setGroup: (group) => set({ group }),
  reset: () => set({ groups: [], group: null }),
}));

const resetAllStores = () => {
  useCompanyStore.getState().reset();
  useGroupStore.getState().reset();
};

export { useCompanyStore, useGroupStore, resetAllStores };
