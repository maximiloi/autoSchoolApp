import { create } from 'zustand';

const useCompanyStore = create((set) => ({
  company: {},
  setCompany: (company) => set({ company }),
  reset: () => set({ company: {} }),
}));

const useGroupStore = create((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  reset: () => set({ groups: [] }),
}));

const resetAllStores = () => {
  useCompanyStore.getState().reset();
  useGroupStore.getState().reset();
};

export { useCompanyStore, useGroupStore, resetAllStores };
