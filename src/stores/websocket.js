import { ref } from 'vue'
import { defineStore } from 'pinia'

const WS_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://h14k009.p.ssafy.io:8080').replace(
  /^http/,
  'ws',
)

export const useWebSocketStore = defineStore('websocket', () => {
  const lastMessage = ref(null)
  let socket = null

  function connect(userId) {
    if (socket) disconnect()
    socket = new WebSocket(`${WS_BASE}/ws/dashboard?userId=${userId}`)

    socket.onmessage = (event) => {
      try {
        lastMessage.value = JSON.parse(event.data)
      } catch {
        lastMessage.value = event.data
      }
    }

    socket.onerror = (e) => console.error('WebSocket error', e)
    socket.onclose = () => {
      socket = null
    }
  }

  function disconnect() {
    socket?.close()
    socket = null
    lastMessage.value = null
  }

  return { lastMessage, connect, disconnect }
})
