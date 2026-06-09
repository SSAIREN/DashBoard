<script setup>
import { ref, computed } from 'vue'
import StatsBar from '@/components/dashboard/StatsBar.vue'
import CaseCard from '@/components/dashboard/CaseCard.vue'
import CaseDetail from '@/components/dashboard/CaseDetail.vue'

defineOptions({ name: 'DashboardView' })

// TODO: WebSocket 연동 시 아래 목업 데이터를 Pinia store(cases.js)로 교체
const cases = [
  {
    id: 1,
    name: '김OO',
    age: 71,
    types: ['기관사칭', '계좌이체요도'],
    risk: 92,
    time: '2:23',
    location: '서울 강남구',
    keywords: ['검찰 수사관', '계좌', '이체'],
    summary: [
      '검찰 수사관을 사칭하며 접근',
      '피해자 계좌가 범죄에 연루됐다고 주장',
      '안전계좌로 즉시 이체 요구 및 구속 협박',
    ],
    process: { gps: true, sms: true, police: true },
  },
  {
    id: 2,
    name: '박OO',
    age: 60,
    types: ['납치협박'],
    risk: 87,
    time: '3:18',
    location: '서울 서초구',
    keywords: ['납치', '아들', '송금'],
    summary: ['아들을 납치했다고 주장', '즉시 송금을 요구'],
    process: { gps: true, sms: false, police: false },
  },
  {
    id: 3,
    name: '이OO',
    age: 65,
    types: ['계좌이체요도'],
    risk: 79,
    time: '2:05',
    location: '서울 강남구',
    keywords: ['안전계좌', '이체', '입금'],
    summary: ['안전계좌로 이체 유도', '즉시 입금 요청'],
    process: { gps: false, sms: false, police: false },
  },
]

// TODO: WebSocket 연동 시 첫 수신 케이스 id로 초기화
const selectedId = ref(1)
const selectedCase = computed(() => cases.find((c) => c.id === selectedId.value) ?? null)

const detailWidth = ref(400)
const isResizing = ref(false)

function startResize(e) {
  isResizing.value = true
  const startX = e.clientX
  const startWidth = detailWidth.value

  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'col-resize'

  function onMove(e) {
    const delta = startX - e.clientX
    detailWidth.value = Math.min(Math.max(startWidth + delta, 220), 600)
  }

  function onUp() {
    isResizing.value = false
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}
</script>

<template>
  <div class="dashboard">
    <div class="main">
      <StatsBar />
      <div class="case-list">
        <CaseCard
          v-for="c in cases"
          :key="c.id"
          :case-data="c"
          :is-selected="selectedId === c.id"
          @select="(id) => (selectedId = id)"
        />
      </div>
    </div>

    <template v-if="selectedCase">
      <div class="resize-handle" :class="{ resizing: isResizing }" @mousedown="startResize" />
      <div class="detail-panel" :style="{ width: detailWidth + 'px' }">
        <CaseDetail :case-data="selectedCase" @close="selectedId = null" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.case-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.resize-handle {
  width: 4px;
  flex-shrink: 0;
  cursor: col-resize;
  background: transparent;
  transition: background 0.15s;
}

.resize-handle:hover,
.resize-handle.resizing {
  background: #2563eb;
}

.detail-panel {
  flex-shrink: 0;
  border-left: 1px solid #e2e8f0;
  background: #fff;
  overflow-y: auto;
  min-width: 220px;
  max-width: 600px;
}
</style>
