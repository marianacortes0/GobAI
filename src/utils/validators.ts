import { z } from 'zod'

export const reporteConfigSchema = z.object({
  tipo: z.string().min(1, 'Selecciona un tipo'),
  periodo: z.string().min(1, 'Selecciona un período'),
  departamento: z.string().optional(),
  formato: z.string().min(1, 'Selecciona un formato'),
})

export type ReporteConfigFormData = z.infer<typeof reporteConfigSchema>
