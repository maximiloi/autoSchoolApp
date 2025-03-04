import { create } from 'zustand';

const useCompanyStore = create((set) => ({
  company: {},
  setCompany: (company) => set({ company }),
}));

export default useCompanyStore;
