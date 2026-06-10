<script setup>
defineOptions({ name: 'StatisticsView' })

// TODO: API 연동 시 GET /api/statistics/summary 응답으로 교체
const summaryCards = [
  {
    label: '총 탐지 건수',
    value: '1,284',
    unit: '건',
    change: '+12%',
    changeUp: true,
    icon: 'clock',
    accentColor: '#2563EB',
  },
  {
    label: '고위험군 탐지',
    value: '342',
    unit: '건',
    change: '+8%',
    changeUp: true,
    icon: 'warning',
    accentColor: '#EF4444',
  },
  {
    label: '계좌 동결 요청',
    value: '89',
    unit: '건',
    change: '-3%',
    changeUp: false,
    icon: 'bank',
    accentColor: '#10B981',
  },
]

// TODO: API 연동 시 GET /api/statistics/keywords 응답으로 교체
const keywords = [
  { rank: 1, word: '검찰청', count: 425 },
  { rank: 2, word: '계좌이체', count: 380 },
  { rank: 3, word: '경찰서', count: 310 },
  { rank: 4, word: '금감원', count: 285 },
  { rank: 5, word: '대포통장', count: 210 },
  { rank: 6, word: '송금', count: 198 },
  { rank: 7, word: 'OTP', count: 176 },
  { rank: 8, word: '수사관', count: 154 },
  { rank: 9, word: '환급', count: 132 },
  { rank: 10, word: '긴급', count: 118 },
]
// TODO: API 연동 시 keywords[0].count 로 동적 계산
const maxCount = 425

// TODO: API 연동 시 GET /api/statistics/age-groups 응답으로 교체
const ageGroups = [
  { label: '60대 이상', count: 578, ratio: '45.0%', highlight: true },
  { label: '50대', count: 312, ratio: '24.3%', highlight: false },
  { label: '40대', count: 185, ratio: '14.4%', highlight: false },
  { label: '30대', count: 120, ratio: '9.3%', highlight: false },
  { label: '20대 이하', count: 89, ratio: '7.0%', highlight: false },
]

// TODO: API 연동 시 GET /api/statistics/repeated-phones 응답으로 교체
const phones = [
  { number: '010-3***-8291', count: 14, countAlert: true, recent: '10분 전', blocked: true },
  { number: '02-5**-1192', count: 8, countAlert: false, recent: '1시간 전', blocked: true },
  { number: '010-8***-3341', count: 5, countAlert: false, recent: '3시간 전', blocked: false },
  { number: '070-4***-9920', count: 4, countAlert: false, recent: '5시간 전', blocked: false },
]

// TODO: API 연동 시 GET /api/statistics/account-freezes 응답으로 교체
const accounts = [
  { bank: '국민', number: '812301-**-***921', time: '14:22', done: true },
  { bank: '신한', number: '110-***-***442', time: '13:45', done: true },
  { bank: '우리', number: '1002-****-***881', time: '12:10', done: false },
  { bank: '카카오', number: '3333-**-***001', time: '09:30', done: true },
]
</script>

<template>
  <div class="stats-page">
    <!-- 상단 요약 카드 -->
    <div class="summary-bar">
      <div v-for="(card, i) in summaryCards" :key="card.label" class="summary-card">
        <div class="card-left">
          <div class="card-icon" :style="{ borderColor: card.accentColor }">
            <!-- clock -->
            <svg
              v-if="card.icon === 'clock'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <!-- warning -->
            <svg
              v-else-if="card.icon === 'warning'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <!-- bank -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="22" x2="21" y2="22" />
              <line x1="6" y1="18" x2="6" y2="11" />
              <line x1="10" y1="18" x2="10" y2="11" />
              <line x1="14" y1="18" x2="14" y2="11" />
              <line x1="18" y1="18" x2="18" y2="11" />
              <polygon points="12 2 20 7 4 7" />
            </svg>
          </div>
          <div class="card-text">
            <span class="card-label">{{ card.label }}</span>
            <span class="card-value"
              >{{ card.value }}<span class="card-unit">{{ card.unit }}</span></span
            >
          </div>
        </div>
        <span class="card-change" :class="card.changeUp ? 'up' : 'down'">
          {{ card.change }}
        </span>
        <div v-if="i < summaryCards.length - 1" class="card-divider" />
      </div>
    </div>

    <!-- 중간 2열 -->
    <div class="grid-2col">
      <!-- 탐지 키워드 TOP 10 -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <svg
              class="title-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            탐지 키워드 TOP 10
          </div>
          <span class="detail-link">상세보기</span>
        </div>
        <div class="keyword-list">
          <div v-for="kw in keywords" :key="kw.rank" class="keyword-row">
            <span class="kw-rank" :class="{ 'rank-1': kw.rank === 1 }">{{ kw.rank }}</span>
            <span class="kw-word">{{ kw.word }}</span>
            <div class="kw-bar-wrap">
              <div
                class="kw-bar"
                :style="{
                  width: ((kw.count / maxCount) * 100).toFixed(1) + '%',
                  background: kw.rank === 1 ? '#2563EB' : '#94a3b8',
                }"
              />
            </div>
            <span class="kw-count">{{ kw.count.toLocaleString() }}건</span>
          </div>
        </div>
      </div>

      <!-- 연령대별 피해 현황 -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <svg
              class="title-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              stroke-width="2"
            >
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            연령대별 피해 현황
          </div>
        </div>
        <div class="age-alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" class="alert-icon">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div class="alert-text">
            <strong>60대 이상 집중 발생</strong>
            <span>최근 1주일간 60대 이상 고연령층 대상 탐지 비율이 45%로 가장 높습니다.</span>
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>연령대</th>
              <th>피해 건수</th>
              <th>비율</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in ageGroups"
              :key="row.label"
              :class="{ 'highlight-row': row.highlight }"
            >
              <td>{{ row.label }}</td>
              <td :class="{ 'red-text': row.highlight }">{{ row.count.toLocaleString() }}</td>
              <td>{{ row.ratio }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 하단 2열 -->
    <div class="grid-2col">
      <!-- 반복 탐지 전화번호 -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <svg
              class="title-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              stroke-width="2"
            >
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.11 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"
              />
            </svg>
            반복 탐지 전화번호
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>탐지 횟수</th>
              <th>최근 탐지</th>
              <th>차단 상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ph in phones" :key="ph.number">
              <td>{{ ph.number }}</td>
              <td :class="{ 'red-text': ph.countAlert }">{{ ph.count }}회</td>
              <td>{{ ph.recent }}</td>
              <td class="status-cell">
                <!-- 차단 아이콘 -->
                <svg
                  v-if="ph.blocked"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#EF4444"
                  stroke-width="2"
                  class="status-icon"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                <!-- 모니터링 아이콘 -->
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#64748b"
                  stroke-width="2"
                  class="status-icon"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 계좌 동결 현황 -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <svg
              class="title-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              stroke-width="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            범인 은급 계좌 동결 현황
          </div>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>은행</th>
              <th>계좌번호 (일부)</th>
              <th>요청 시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="acc in accounts" :key="acc.number">
              <td>{{ acc.bank }}</td>
              <td>{{ acc.number }}</td>
              <td>{{ acc.time }}</td>
              <td class="status-cell">
                <svg
                  v-if="acc.done"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#10B981"
                  stroke-width="2.5"
                  class="status-icon"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F59E0B"
                  stroke-width="2"
                  class="status-icon"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #1e293b;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 상단 요약 카드 바 */
.summary-bar {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: stretch;
  position: relative;
}

.summary-card {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 36px;
  position: relative;
}

.card-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.card-icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #64748b;
}

.card-icon svg {
  width: 26px;
  height: 26px;
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-label {
  font-size: 13px;
  color: #64748b;
}

.card-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.card-unit {
  font-size: 16px;
  font-weight: 400;
  margin-left: 4px;
  color: #475569;
}

.card-change {
  font-size: 14px;
  font-weight: 600;
}

.card-change.up {
  color: #ef4444;
}

.card-change.down {
  color: #10b981;
}

.card-divider {
  position: absolute;
  right: 0;
  top: 16px;
  bottom: 16px;
  width: 1px;
  background: #e2e8f0;
}

/* 2열 그리드 */
.grid-2col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 패널 공통 */
.panel {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.title-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.detail-link {
  font-size: 12px;
  color: #2563eb;
  cursor: default;
}

/* 키워드 바 차트 */
.keyword-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  max-height: 320px;
}

.keyword-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kw-rank {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  flex-shrink: 0;
}

.kw-rank.rank-1 {
  background: #2563eb;
  color: #fff;
}

.kw-word {
  width: 72px;
  font-size: 13px;
  color: #334155;
  flex-shrink: 0;
}

.kw-bar-wrap {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.kw-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease;
}

.kw-count {
  width: 48px;
  text-align: right;
  font-size: 12px;
  color: #64748b;
  flex-shrink: 0;
}

/* 연령대 경고 배너 */
.age-alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 12px 14px;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

.alert-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}

.alert-text strong {
  color: #1e293b;
  font-weight: 600;
}

.alert-text span {
  color: #64748b;
  line-height: 1.4;
}

/* 공통 테이블 */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 8px 12px;
  color: #64748b;
  font-weight: 500;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
}

.data-table td {
  padding: 12px 12px;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover td {
  background: #f8fafc;
}

.highlight-row td {
  font-weight: 600;
}

.red-text {
  color: #ef4444 !important;
  font-weight: 600;
}

.status-cell {
  text-align: center;
}

.status-icon {
  width: 20px;
  height: 20px;
}
</style>
