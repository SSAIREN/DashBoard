<script setup>
defineOptions({ name: 'DashboardStatsBar' })

defineProps({
  activeTab: { type: String, default: 'in_progress' },
  inProgressCount: { type: Number, default: 0 },
  completedCount: { type: Number, default: 0 },
})

const emit = defineEmits(['tab-change'])
</script>

<template>
  <div class="stats-bar">
    <div
      class="stat-card clickable"
      :class="{ 'active-danger': activeTab === 'in_progress' }"
      @click="emit('tab-change', 'in_progress')"
    >
      <div class="stat-top">
        <span class="stat-label">위험 진행중</span>
        <svg
          class="icon danger"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <div class="stat-bottom">
        <span class="num danger">{{ inProgressCount }}</span>
        <span class="unit">건</span>
      </div>
    </div>

    <div
      class="stat-card clickable"
      :class="{ 'active-safe': activeTab === 'completed' }"
      @click="emit('tab-change', 'completed')"
    >
      <div class="stat-top">
        <span class="stat-label">대응 완료</span>
        <svg
          class="icon safe"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </div>
      <div class="stat-bottom">
        <span class="num safe">{{ completedCount }}</span>
        <span class="unit">건</span>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-top">
        <span class="stat-label">평균 대응시간</span>
        <svg
          class="icon accent"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <!-- TODO: API 연동 시 평균 대응시간(분/초)으로 교체 -->
      <div class="stat-bottom">
        <span class="num accent">2</span>
        <span class="unit">분</span>
        <span class="num accent">14</span>
        <span class="unit">초</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 2px solid transparent;
}

.stat-card.clickable {
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}

.stat-card.clickable:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.active-danger {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.stat-card.active-safe {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.icon {
  flex-shrink: 0;
}
.icon.danger {
  color: #ef4444;
}
.icon.safe {
  color: #10b981;
}
.icon.accent {
  color: #2563eb;
}

.stat-bottom {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.num {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.num.danger {
  color: #ef4444;
}
.num.safe {
  color: #10b981;
}
.num.accent {
  color: #2563eb;
}

.unit {
  font-size: 14px;
  color: #94a3b8;
}
</style>
