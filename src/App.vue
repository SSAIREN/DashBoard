<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
</script>

<template>
  <div class="layout">
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
