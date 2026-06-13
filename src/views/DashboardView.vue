<script setup>
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { casesApi } from '@/api/cases.js'
import { useAuthStore } from '@/stores/auth.js'
import { useWebSocketStore } from '@/stores/websocket.js'
import StatsBar from '@/components/dashboard/StatsBar.vue'
import CaseCard from '@/components/dashboard/CaseCard.vue'
import CaseDetail from '@/components/dashboard/CaseDetail.vue'

defineOptions({ name: 'DashboardView' })

const cases = reactive([])
const avgResponseSec = ref(0)

const activeTab = ref('IN_PROGRESS')
const filteredCases = computed(() => cases.filter((c) => c.status === activeTab.value))
const inProgressCount = computed(() => cases.filter((c) => c.status === 'IN_PROGRESS').length)
const completedCount = computed(() => cases.filter((c) => c.status === 'COMPLETED').length)

function handleTabChange(tab) {
  activeTab.value = tab
  selectedId.value = filteredCases.value[0]?.caseId ?? null
}

const selectedId = ref(null)
const selectedDetail = ref(null)

const selectedCase = computed(() => {
  const base = cases.find((c) => c.caseId === selectedId.value) ?? null
  if (!base) return null
  return selectedDetail.value?.caseId === selectedId.value
    ? { ...base, ...selectedDetail.value }
    : base
})

watch(selectedId, async (newId) => {
  selectedDetail.value = null
  if (!newId) return
  try {
    selectedDetail.value = await casesApi.getDetail(newId)
  } catch {
    // 상세 조회 실패 시 목록 데이터만 표시
  }
})

function handleComplete(caseId) {
  const target = cases.find((c) => c.caseId === caseId)
  if (target) target.status = 'COMPLETED'
  selectedId.value = filteredCases.value[0]?.caseId ?? null
}

async function fetchCases() {
  try {
    const data = await casesApi.getList()
    cases.splice(0, cases.length, ...data)
    selectedId.value = filteredCases.value[0]?.caseId ?? null
  } catch (e) {
    console.error('케이스 목록 조회 실패', e)
  }
}

async function fetchSummary() {
  try {
    const data = await casesApi.getSummary()
    avgResponseSec.value = data.avgResponseSec
  } catch (e) {
    console.error('요약 조회 실패', e)
  }
}

const auth = useAuthStore()
const wsStore = useWebSocketStore()
const { lastMessage } = storeToRefs(wsStore)

watch(lastMessage, (msg) => {
    if (!msg) return
    if (msg.type === 'NEW_CASE') {
      fetchCases()
      fetchSummary()
    } else if (msg.type === 'ACTION_UPDATE' && selectedId.value === msg.caseId) {
      casesApi.getDetail(msg.caseId).then((data) => {
        selectedDetail.value = data
      }).catch(() => {})
    }
  },
)

onMounted(() => {
  fetchCases()
  fetchSummary()
  // 페이지 리로드 시 이미 로그인된 상태면 WebSocket 재연결
  if (auth.currentUser?.wsUserId) {
    wsStore.connect(auth.currentUser.wsUserId)
  }
})

onUnmounted(() => {
  wsStore.disconnect()
})

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
        :avg-response-sec="avgResponseSec"
        @tab-change="handleTabChange"
      />
      <div class="case-list">
        <CaseCard
          v-for="c in filteredCases"
          :key="c.caseId"
          :case-data="c"
          :is-selected="selectedId === c.caseId"
          @select="(caseId) => (selectedId = caseId)"
        />
        <div v-if="filteredCases.length === 0" class="empty-state">해당 케이스가 없습니다.</div>
      </div>
    </div>

    <template v-if="selectedCase">
      <div class="resize-handle" :class="{ resizing: isResizing }" @mousedown="startResize" />
      <div class="detail-panel" :style="{ width: detailWidth + 'px' }">
        <CaseDetail :case-data="selectedCase" @close="selectedId = null" @complete="handleComplete" />
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
