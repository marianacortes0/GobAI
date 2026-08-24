import axios from 'axios'

// FastAPI's Query(List[str]) expects repeated bare keys (ids=a&ids=b), not
// axios's default bracket notation (ids[]=a&ids[]=b) — without this, array
// filters are silently dropped server-side.
function serializeParams(params: Record<string, unknown>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)))
    } else {
      search.append(key, String(value))
    }
  }
  return search.toString()
}

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  paramsSerializer: { serialize: serializeParams },
})

export default api
