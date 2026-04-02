import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000,
})

export const sendMessage = async (message, sessionId, history, mode, onChunk) => {
  const response = await fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      session_id: sessionId,
      history,
      mode: {
        fast: mode.fast || false,
        thinking: mode.thinking || false,
        search: mode.search || false,
      },
    }),
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          onChunk(data)
          if (data.type === 'done') {
            return
          }
        } catch (e) {}
      }
    }
  }
}

export const generateTitle = async (message) => {
  const response = await api.post('/session/title', { message })
  return response.data.title
}

export const getHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export const getSessionHistory = async (sessionId) => {
  const response = await api.get(`/session/${sessionId}`)
  return response.data
}

export const clearSession = async (sessionId) => {
  const response = await api.delete(`/session/${sessionId}`)
  return response.data
}

export default api