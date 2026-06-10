<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'

const route = useRoute()
const isFullscreen = computed(() => route.path === '/login')
</script>

<template>
  <RouterView v-if="isFullscreen" />
  <div v-else class="layout">
    <Sidebar />
    <Header />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr;
  height: 100vh;
}

.layout > :first-child {
  grid-row: 1 / -1;
}

.content {
  overflow-y: auto;
  background-color: #f1f5f9;
}
</style>
