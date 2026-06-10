<script setup>
import logoName from '@/assets/logoName.svg'
import { useAuthStore } from '@/stores/auth'

defineOptions({ name: 'AppSidebar' })

const auth = useAuthStore()

const menus = [
  { label: '실시간 모니터링', to: '/' },
  { label: '통계', to: '/statistics' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="logo">
      <img :src="logoName" alt="SSAIREN" class="logo-img" />
    </div>

    <nav class="nav">
      <RouterLink
        v-for="menu in menus"
        :key="menu.to"
        :to="menu.to"
        class="nav-item"
        active-class="nav-item--active"
        exact-active-class="nav-item--active"
      >
        {{ menu.label }}
      </RouterLink>
    </nav>

    <div class="bottom">
      <button class="logout-btn" @click="auth.logout()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="logout-icon">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        로그아웃
      </button>
      <div class="version">v1.0.4 Protective SSAIREN AI</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px;
  height: 100%;
  background-color: var(--color-bg);
  border-right: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px 24px;
  border-bottom: 1px solid #1e293b;
}

.logo-icon {
  font-size: 20px;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: 0.05em;
}

.nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 12px;
}

.nav-item {
  display: block;
  padding: 10px 12px;
  border-radius: 6px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.nav-item:hover {
  background-color: #1e293b;
  color: #f1f5f9;
}

.nav-item--active {
  background-color: var(--color-accent);
  color: #ffffff;
}

.bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #f87171;
  font-size: 14px;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.16);
  border-color: rgba(239, 68, 68, 0.35);
  color: #ef4444;
}

.logout-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.version {
  padding: 0 8px 0;
  font-size: 11px;
  color: #475569;
}
</style>
