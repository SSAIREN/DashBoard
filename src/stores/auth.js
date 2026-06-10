import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

// TODO: DB 연동 시 아래 MOCK_USER 제거 후 POST /api/auth/login 호출로 교체
const MOCK_USER = {
  id: 'admin',
  password: '1234',
  name: '이영주',
  rank: '경위',
  unit: '종합상황실',
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const isAuthenticated = ref(false)
  const currentUser = ref(null)

  function login(id, password) {
    if (id === MOCK_USER.id && password === MOCK_USER.password) {
      isAuthenticated.value = true
      currentUser.value = {
        name: MOCK_USER.name,
        rank: MOCK_USER.rank,
        unit: MOCK_USER.unit,
      }
      return true
    }
    return false
  }

  function logout() {
    isAuthenticated.value = false
    currentUser.value = null
    router.push('/login')
  }

  return { isAuthenticated, currentUser, login, logout }
})
