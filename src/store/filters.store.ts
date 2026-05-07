import { create } from 'zustand'
import type { Filters } from '@/types/shared.types'

interface FiltersState {
  dashboardFilters: Filters
  contratosFilters: Filters
  alertasFilters: Filters
  reportesFilters: Filters
  setDashboardFilters: (f: Partial<Filters>) => void
  setContratosFilters: (f: Partial<Filters>) => void
  setAlertasFilters: (f: Partial<Filters>) => void
  setReportesFilters: (f: Partial<Filters>) => void
  resetFilters: (page: 'dashboard' | 'contratos' | 'alertas' | 'reportes') => void
}

const defaultFilters: Filters = { page: 1, limit: 10 }

export const useFiltersStore = create<FiltersState>((set) => ({
  dashboardFilters: defaultFilters,
  contratosFilters: defaultFilters,
  alertasFilters: defaultFilters,
  reportesFilters: defaultFilters,
  setDashboardFilters: (f) => set((s) => ({ dashboardFilters: { ...s.dashboardFilters, ...f, page: 1 } })),
  setContratosFilters: (f) => set((s) => ({ contratosFilters: { ...s.contratosFilters, ...f, page: 1 } })),
  setAlertasFilters: (f) => set((s) => ({ alertasFilters: { ...s.alertasFilters, ...f, page: 1 } })),
  setReportesFilters: (f) => set((s) => ({ reportesFilters: { ...s.reportesFilters, ...f, page: 1 } })),
  resetFilters: (page) => set({ [`${page}Filters`]: defaultFilters }),
}))
