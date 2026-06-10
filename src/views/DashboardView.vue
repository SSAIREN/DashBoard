<script setup>
import { ref, computed } from 'vue'
import StatsBar from '@/components/dashboard/StatsBar.vue'
import CaseCard from '@/components/dashboard/CaseCard.vue'
import CaseDetail from '@/components/dashboard/CaseDetail.vue'

defineOptions({ name: 'DashboardView' })

// TODO: WebSocket 연동 시 in_progress 케이스를 Pinia store(cases.js)로 교체
// TODO: DB API 연동 시 completed 케이스를 별도 API 호출로 교체
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
    status: 'in_progress',
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
    status: 'in_progress',
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
    status: 'in_progress',
  },
  // 이하 completed 케이스: DB에서 조회
  {
    id: 4,
    name: '최OO',
    age: 68,
    types: ['기관사칭'],
    risk: 88,
    time: '1:45',
    location: '서울 송파구',
    keywords: ['금융감독원', '계좌', '동결'],
    summary: ['금융감독원을 사칭하며 계좌 동결 위협', '보안계좌로 이체 요구'],
    process: { gps: true, sms: true, police: true },
    status: 'completed',
  },
  {
    id: 5,
    name: '정OO',
    age: 73,
    types: ['납치협박'],
    risk: 91,
    time: '3:02',
    location: '서울 마포구',
    keywords: ['딸', '납치', '현금'],
    summary: ['딸을 납치했다고 협박', '현금 전달 요구'],
    process: { gps: true, sms: true, police: true },
    status: 'completed',
  },
  {
    id: 6,
    name: '윤OO',
    age: 62,
    types: ['계좌이체요도'],
    risk: 76,
    time: '0:58',
    location: '서울 강서구',
    keywords: ['안전계좌', '즉시이체', '경찰'],
    summary: ['경찰을 사칭하며 안전계좌 이체 유도'],
    process: { gps: true, sms: true, police: true },
    status: 'completed',
  },
  {
    id: 7,
    name: '한OO',
    age: 77,
    types: ['기관사칭', '계좌이체요도'],
    risk: 83,
    time: '2:31',
    location: '경기 성남시',
    keywords: ['검사', '범죄연루', '이체'],
    summary: ['검사 사칭으로 범죄 연루 주장', '즉시 이체 요구'],
    process: { gps: true, sms: true, police: true },
    status: 'completed',
  },
]

const activeTab = ref('in_progress')
const filteredCases = computed(() => cases.filter((c) => c.status === activeTab.value))
const inProgressCount = computed(() => cases.filter((c) => c.status === 'in_progress').length)
const completedCount = computed(() => cases.filter((c) => c.status === 'completed').length)

function handleTabChange(tab) {
  activeTab.value = tab
  selectedId.value = filteredCases.value[0]?.id ?? null
}

const selectedId = ref(filteredCases.value[0]?.id ?? null)
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
      <StatsBar
        :active-tab="activeTab"
        :in-progress-count="inProgressCount"
        :completed-count="completedCount"
        @tab-change="handleTabChange"
      />
      <div class="case-list">
        <CaseCard
          v-for="c in filteredCases"
          :key="c.id"
          :case-data="c"
          :is-selected="selectedId === c.id"
          @select="(id) => (selectedId = id)"
        />
        <div v-if="filteredCases.length === 0" class="empty-state">해당 케이스가 없습니다.</div>
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

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 40px 0;
  font-size: 14px;
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
