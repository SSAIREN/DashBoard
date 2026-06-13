<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { casesApi } from '@/api/cases.js'

defineOptions({ name: 'DashboardCaseDetail' })

const props = defineProps({
  caseData: { type: Object, required: true },
})

const emit = defineEmits(['close', 'complete'])

const completing = ref(false)

async function handleComplete() {
  completing.value = true
  try {
    await casesApi.patchStatus(props.caseData.caseId, 'COMPLETED')
    emit('complete', props.caseData.caseId)
  } finally {
    completing.value = false
  }
}

const PHISHING_LABELS = {
  AGENCY_IMPERSONATION: '기관 사칭',
  ACCOUNT_TRANSFER_INDUCEMENT: '계좌 이체 요구',
  KIDNAPPING_THREAT: '납치 협박',
  REMOTE_APP_INSTALLATION: '원격 조정 앱 설치',
}

const TAG_COLORS = {
  AGENCY_IMPERSONATION: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  KIDNAPPING_THREAT: { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
  ACCOUNT_TRANSFER_INDUCEMENT: { bg: '#fff7ed', color: '#f59e0b', border: '#fed7aa' },
  REMOTE_APP_INSTALLATION: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
}

function riskColor(risk) {
  if (risk >= 90) return '#ef4444'
  if (risk >= 80) return '#f59e0b'
  return '#eab308'
}

function tagStyle(type) {
  const c = TAG_COLORS[type] ?? { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' }
  return { backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }
}

const caseNumber = computed(() => `#2024-00${props.caseData.caseId}`)

const phishingTypes = computed(() =>
  props.caseData.phishingType ? [props.caseData.phishingType] : [],
)

const mapContainerRef = ref(null)
let mapInstance = null
let currentMarker = null

let sdkPromise = null
function loadKakaoSdk() {
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve) => {
    if (window.kakao?.maps) { resolve(); return }
    const s = document.createElement('script')
    s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&libraries=services&autoload=false`
    s.onload = () => window.kakao.maps.load(resolve)
    document.head.appendChild(s)
  })
  return sdkPromise
}

function placeMarker() {
  if (!mapInstance || !window.kakao?.maps) return
  if (currentMarker) { currentMarker.setMap(null); currentMarker = null }
  if (!props.caseData.region) return

  const geocoder = new window.kakao.maps.services.Geocoder()
  geocoder.addressSearch(props.caseData.region, (result, status) => {
    if (status !== window.kakao.maps.services.Status.OK) return
    const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x)
    currentMarker = new window.kakao.maps.Marker({ map: mapInstance, position: coords })
    mapInstance.setCenter(coords)
    mapInstance.setLevel(3)
  })
}

async function initMap() {
  await loadKakaoSdk()
  if (!mapContainerRef.value) return
  const { kakao } = window
  mapInstance = new kakao.maps.Map(mapContainerRef.value, {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 5,
  })
  placeMarker()
}

onMounted(initMap)
watch(() => props.caseData.caseId, () => mapInstance ? placeMarker() : initMap())

const ACTION_LABELS = { GPS: '위치 파악', SMS: '가족 알림', POLICE: '경찰 통보' }
const ACTION_ORDER = ['GPS', 'SMS', 'POLICE']

const steps = computed(() =>
  ACTION_ORDER.map((type) => {
    const action = props.caseData.actions?.find((a) => a.actionType === type)
    return {
      key: type,
      label: ACTION_LABELS[type],
      status: action?.status ?? 'PENDING',
    }
  }),
)
</script>

<template>
  <div class="detail">
    <!-- 헤더 -->
    <div class="detail-header">
      <div class="header-info">
        <div class="header-name-row">
          <span class="detail-name">{{ caseData.victimName }}</span>
          <span class="detail-sub">({{ caseData.age }}세)</span>
          <span class="case-num">{{ caseNumber }}</span>
        </div>
        <div class="type-tags">
          <span
            v-for="type in phishingTypes"
            :key="type"
            class="type-tag"
            :style="tagStyle(type)"
            >{{ PHISHING_LABELS[type] ?? type }}</span
          >
        </div>
      </div>
      <div class="header-right">
        <div class="risk-badge" :style="{ backgroundColor: riskColor(caseData.riskScore) }">
          {{ caseData.riskScore }}
        </div>
        <button class="close-btn" @click="emit('close')">✕</button>
      </div>
    </div>

    <div class="detail-body">
      <!-- AI 통화 분석 요약 -->
      <section class="section">
        <h3 class="section-title">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6M9 12h6M9 15h4" />
          </svg>
          AI 통화 분석 요약
        </h3>
        <p class="summary-text">{{ caseData.aiSummary }}</p>
      </section>

      <!-- 위치 정보 -->
      <section class="section">
        <h3 class="section-title">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          위치 정보
        </h3>
        <div ref="mapContainerRef" class="map-container"></div>
        <div class="location-row">
          <span class="location-name">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563eb"
              stroke-width="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {{ caseData.region ?? '위치 미확인' }}
          </span>
          <!-- TODO: API 연동 시 인근 경찰서명·거리 데이터로 교체 -->
          <span class="police-dist">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              stroke-width="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            서초경찰서 1.2km
          </span>
        </div>
      </section>

      <!-- 대응 프로세스 -->
      <section class="section">
        <h3 class="section-title">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          대응 프로세스
        </h3>
        <div class="steps">
          <template v-for="(step, i) in steps" :key="step.key">
            <div class="step-item">
              <div class="step-circle" :class="step.status.toLowerCase().replace('_', '-')">
                <svg
                  v-if="step.status === 'COMPLETED'"
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="#fff" stroke-width="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else-if="step.status === 'FAILED'"
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="#fff" stroke-width="3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <span class="step-label">{{ step.label }}</span>
            </div>
            <div
              v-if="i < steps.length - 1"
              class="step-line"
              :class="{ done: step.status === 'COMPLETED' }"
            />
          </template>
        </div>
      </section>

      <!-- TODO: API 연동 시 경찰 대기 상태 동적으로 교체 -->
      <div v-if="caseData.status !== 'COMPLETED'" class="police-status">
        <span class="status-dot"></span>
        경찰 대응 대기중
      </div>
    </div>

    <!-- 하단 버튼 -->
    <div v-if="caseData.status !== 'COMPLETED'" class="detail-footer">
      <button class="btn-dispatch">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        현장 출동 지시
      </button>
      <button class="btn-call">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.12 6.12l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
          />
        </svg>
        피해자 연결
      </button>
      <button class="btn-close-case" :disabled="completing" @click="handleComplete">
        {{ completing ? '처리 중...' : '사건 종료' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  gap: 8px;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.header-name-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}

.detail-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.detail-sub {
  font-size: 13px;
  color: #64748b;
}

.case-num {
  font-size: 12px;
  color: #94a3b8;
}

.type-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.type-tag {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 999px;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.risk-badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 4px;
}

.close-btn:hover {
  color: #0f172a;
}

.detail-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-text {
  background: #eff6ff;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 12px;
  color: #1e3a5f;
  line-height: 1.6;
  margin: 0;
}

.map-container {
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  background: #e2e8f0;
}

.location-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-name,
.police-dist {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #475569;
}

/* 대응 프로세스 */
.steps {
  display: flex;
  align-items: flex-start;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.step-circle.completed {
  background: #10b981;
  border-color: #10b981;
}

.step-circle.in-progress {
  background: #2563eb;
  border-color: #2563eb;
  animation: pulse 1.5s ease-in-out infinite;
}

.step-circle.failed {
  background: #ef4444;
  border-color: #ef4444;
}

.step-label {
  font-size: 11px;
  color: #64748b;
  text-align: center;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin-top: 13px;
  flex-shrink: 1;
  min-width: 16px;
}

.step-line.done {
  background: #10b981;
}

/* 경찰 대기 상태 */
.police-status {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #1e40af;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563eb;
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

/* 하단 버튼 */
.detail-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e2e8f0;
}

.btn-dispatch,
.btn-call,
.btn-close-case {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 10px 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.btn-dispatch {
  background: #0f172a;
  color: #fff;
}

.btn-dispatch:hover {
  background: #1e293b;
}

.btn-call {
  background: #fff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.btn-call:hover {
  background: #eff6ff;
}

.btn-close-case {
  background: #f1f5f9;
  color: #64748b;
}

.btn-close-case:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-close-case:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
