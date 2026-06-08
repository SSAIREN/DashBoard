<script setup>
import logoName from '@/assets/logoName.svg'

defineOptions({ name: 'AppSidebar' })

const menus = [
  { label: '실시간 모니터링', to: '/' },
  { label: '통계', to: '/statistics' },
  { label: '설정', to: '/settings' },
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

    <div class="version">v1.0.4 Protective SSAIREN AI</div>
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

.version {
  padding: 0 20px;
  font-size: 11px;
  color: #475569;
}
</style>
