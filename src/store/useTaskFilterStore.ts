import { create } from 'zustand';

interface FilterState {
  searchQuery: string;
  statusFilter: 'ALL' | 'COMPLETED' | 'PENDING';
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: 'ALL' | 'COMPLETED' | 'PENDING') => void;
}

export const useTaskFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  statusFilter: 'ALL',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
