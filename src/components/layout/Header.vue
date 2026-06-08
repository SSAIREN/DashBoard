<script setup>
defineOptions({ name: 'AppHeader' })

import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const titleMap = {
  '/': '실시간 모니터링',
  '/statistics': '통계',
  '/settings': '설정',
}

const title = computed(() => titleMap[route.path] ?? '')
</script>

<template>
  <header class="header">
    <h1 class="title">{{ title }}</h1>

    <div class="right">
      <span class="badge">
        <span class="badge-dot"></span>
        실시간 연결 중
      </span>

      <button class="icon-btn" aria-label="알림">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>

      <div class="user">
        <span class="user-name">이영주 경위</span>
        <span class="user-role">경위·종합상황실</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  height: 60px;
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-safe);
  background-color: #052e16;
  padding: 4px 10px;
  border-radius: 999px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-safe);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.icon-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
}

.icon-btn:hover {
  color: #0f172a;
}

.user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.user-role {
  font-size: 11px;
  color: #64748b;
}
</style>
