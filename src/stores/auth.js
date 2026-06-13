import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

const STORAGE_KEY = 'auth_user'

// TODO: DB 연동 시 아래 MOCK_USER 제거 후 POST /api/auth/login 호출로 교체
const MOCK_USER = {
  id: 'admin',
  password: '1234',
  name: '이영주',
  rank: '경위',
  unit: '종합상황실',
  wsUserId: 9005,
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const saved = localStorage.getItem(STORAGE_KEY)
  const isAuthenticated = ref(!!saved)
  const currentUser = ref(saved ? JSON.parse(saved) : null)

  function login(id, password) {
    if (id === MOCK_USER.id && password === MOCK_USER.password) {
      const user = {
        name: MOCK_USER.name,
        rank: MOCK_USER.rank,
        unit: MOCK_USER.unit,
        wsUserId: MOCK_USER.wsUserId,
      }
      isAuthenticated.value = true
      currentUser.value = user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
    router.push('/login')
  }

  return { isAuthenticated, currentUser, login, logout }
})
