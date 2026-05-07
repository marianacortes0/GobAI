export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: Record<string, string[]>
}

export interface RequestConfig {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}
