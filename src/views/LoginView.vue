<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineOptions({ name: 'LoginView' })

const router = useRouter()
const auth = useAuthStore()

const showPassword = ref(false)
const saveId = ref(false)
const username = ref('')
const password = ref('')
const errorMsg = ref('')

function handleLogin() {
  errorMsg.value = ''
  const ok = auth.login(username.value, password.value)
  if (ok) {
    router.push('/')
  } else {
    errorMsg.value = '아이디 또는 비밀번호가 올바르지 않습니다.'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="card-header">
        <h2 class="card-title">로그인</h2>
        <p class="card-subtitle">SSAIREN 관제 시스템에 오신 것을 환영합니다</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <!-- 아이디 -->
        <div class="field">
          <label class="field-label" for="username">아이디</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="field-input"
            :class="{ 'field-input--error': errorMsg }"
            placeholder="아이디를 입력하세요"
            autocomplete="username"
          />
        </div>

        <!-- 비밀번호 -->
        <div class="field">
          <div class="field-label-row">
            <label class="field-label" for="password">비밀번호</label>
            <a href="#" class="forgot-link">비밀번호 찾기</a>
          </div>
          <div class="password-wrap">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              :class="{ 'field-input--error': errorMsg }"
              placeholder="비밀번호를 입력하세요"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="toggle-pw"
              :aria-label="showPassword ? '비밀번호 숨기기' : '비밀번호 표시'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 아이디 저장 -->
        <label class="checkbox-label">
          <input v-model="saveId" type="checkbox" class="checkbox-input" />
          <span class="checkbox-box" :class="{ checked: saveId }">
            <svg v-if="saveId" viewBox="0 0 12 12" fill="none" stroke="#fff" stroke-width="2">
              <polyline points="2,6 5,9 10,3" />
            </svg>
          </span>
          <span class="checkbox-text">아이디 저장</span>
        </label>

        <!-- 에러 메시지 -->
        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <!-- 로그인 버튼 -->
        <button type="submit" class="login-btn">로그인</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f1f5f9;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}

.login-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.card-subtitle {
  font-size: 14px;
  color: #64748b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.forgot-link {
  font-size: 12px;
  color: #64748b;
  text-decoration: none;
}

.forgot-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.field-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  color: #1e293b;
  background: #fff;
  outline: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
  box-sizing: border-box;
}

.field-input::placeholder {
  color: #94a3b8;
}

.field-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.password-wrap {
  position: relative;
}

.password-wrap .field-input {
  padding-right: 44px;
}

.toggle-pw {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.toggle-pw:hover {
  color: #64748b;
}

.toggle-pw svg {
  width: 18px;
  height: 18px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-box {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid #cbd5e1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.checkbox-box.checked {
  background: #2563eb;
  border-color: #2563eb;
}

.checkbox-box svg {
  width: 11px;
  height: 11px;
}

.checkbox-text {
  font-size: 13px;
  color: #475569;
}

.login-btn {
  width: 100%;
  padding: 13px;
  background: #2563eb;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.login-btn:hover {
  background: #1d4ed8;
}

.login-btn:active {
  background: #1e40af;
}

.field-input--error {
  border-color: #ef4444;
}

.field-input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.error-msg {
  font-size: 13px;
  color: #ef4444;
  text-align: center;
  margin-top: -8px;
}

@media (max-width: 768px) {
  .login-card {
    margin: 16px;
    padding: 32px 24px;
  }
}
</style>
