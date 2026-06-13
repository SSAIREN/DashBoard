<script setup>
defineOptions({ name: 'DashboardCaseCard' })

defineProps({
  caseData: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

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

function riskColor(score) {
  if (score >= 90) return '#ef4444'
  if (score >= 80) return '#f59e0b'
  return '#eab308'
}

function tagStyle(type) {
  const c = TAG_COLORS[type] ?? { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' }
  return { backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60)
  const s = String(sec % 60).padStart(2, '0')
  return `${m}:${s}`
}
</script>

<template>
  <div
    class="case-card"
    :class="{ selected: isSelected, completed: caseData.status === 'COMPLETED' }"
    @click="emit('select', caseData.caseId)"
  >
    <div class="row-top">
      <div class="name-area">
        <span class="victim-name">{{ caseData.victimName }} ({{ caseData.age }}세)</span>
        <span class="type-tag" :style="tagStyle(caseData.phishingType)">
          {{ PHISHING_LABELS[caseData.phishingType] ?? caseData.phishingType }}
        </span>
      </div>
      <div class="risk-area">
        <span class="risk-num" :style="{ color: riskColor(caseData.riskScore) }">{{
          caseData.riskScore
        }}</span>
        <span class="risk-label">위험지수</span>
      </div>
    </div>

    <div class="meta-row">
      <span class="meta-item">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {{ formatDuration(caseData.callDurationSec) }}
      </span>
      <span class="meta-item">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        {{ caseData.region ?? '-' }}
      </span>
    </div>

    <div class="gauge-track">
      <div
        class="gauge-fill"
        :style="{ width: `${caseData.riskScore}%`, backgroundColor: riskColor(caseData.riskScore) }"
      />
    </div>

    <div class="row-bottom">
      <div class="keywords">
        <span
          v-for="kw in (caseData.keywords ? caseData.keywords.split(',') : [])"
          :key="kw"
          class="kw"
          >#{{ kw.trim() }}</span
        >
      </div>
      <button v-if="caseData.status !== 'COMPLETED'" class="respond-btn" @click.stop>
        대응하기
      </button>
      <span v-else class="completed-badge">완료</span>
    </div>
  </div>
</template>

<style scoped>
.case-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.15s;
}

.case-card.selected {
  border-color: #2563eb;
}
.case-card:hover:not(.selected) {
  border-color: #e2e8f0;
}

.row-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.name-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.victim-name {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
}

.type-tag {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 999px;
}

.risk-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.risk-num {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.risk-label {
  font-size: 10px;
  color: #94a3b8;
}

.meta-row {
  display: flex;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.gauge-track {
  height: 6px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  border-radius: 999px;
}

.row-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.keywords {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.kw {
  font-size: 11px;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 999px;
}

.respond-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
}

.respond-btn:hover {
  background: #1d4ed8;
}

.case-card.completed {
  opacity: 0.75;
  background: #f8fafc;
}

.completed-badge {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
