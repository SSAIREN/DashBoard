import { ref } from 'vue'
import { defineStore } from 'pinia'

const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
const WS_BASE = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws')
  : `${wsProtocol}://h14k009.p.ssafy.io:8080`

export const useWebSocketStore = defineStore('websocket', () => {
  const lastMessage = ref(null)
  const failed = ref(false)
  let socket = null

  function connect(userId) {
    if (socket) disconnect()
    failed.value = false

    try {
      socket = new WebSocket(`${WS_BASE}/ws/dashboard?userId=${userId}`)
    } catch {
      failed.value = true
      return
    }

    socket.onerror = () => {
      failed.value = true
    }

    socket.onmessage = (event) => {
      try {
        lastMessage.value = JSON.parse(event.data)
      } catch {
        lastMessage.value = event.data
      }
    }

    socket.onclose = () => {
      socket = null
    }
  }

  function disconnect() {
    socket?.close()
    socket = null
    lastMessage.value = null
    failed.value = false
  }

  return { lastMessage, failed, connect, disconnect }
})
