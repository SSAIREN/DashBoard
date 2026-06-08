# 🚨 SSAIREN 경찰 관제 대시보드

> 실시간 보이스피싱 피해 모니터링 웹 서비스

<br>

## 프로젝트 소개

SSAIREN 경찰 관제 대시보드는 보이스피싱 피해가 탐지될 때 실시간으로 케이스를 수신하고 대응 상황을 모니터링하는 웹 서비스입니다.  
SSAIREN Android 앱에서 위험도 임계값(0.8)을 초과한 케이스가 발생하면 WebSocket을 통해 대시보드에 즉시 전달됩니다.

<br>

## 기술 스택

- **Framework** : Vue.js 3 (Composition API)
- **언어** : JavaScript
- **상태 관리** : Pinia
- **라우팅** : Vue Router
- **통신** : WebSocket (`/ws/dashboard`), REST API
- **지도** : KakaoMap API
- **서버 연결** : Spring Boot (API Gateway) → FastAPI (AI 서버)
- **배포** : AWS EC2

<br>

## 페이지 구성

| 경로          | 페이지          | 설명                                      |
| ------------- | --------------- | ----------------------------------------- |
| `/`           | 실시간 모니터링 | WebSocket 기반 케이스 실시간 수신 및 대응 |
| `/statistics` | 통계            | 탐지 데이터 집계 및 분석                  |

<br>

## 기능 명세

### 실시간 모니터링 (`/`)

**상단 통계 카드**

- 위험 진행 중 건수
- 대응 완료 건수
- 평균 대응 시간

**케이스 목록**

- 페이지 진입 시 WebSocket `/ws/dashboard` 연결 자동 수립 및 유지
- 새 피해 케이스 발생 시 목록에 실시간 추가
- 위험도 높은 순 자동 정렬
- 케이스 카드 표시 정보:
  - 피해자 이름 / 나이
  - 피해 유형 태그 (기관사칭 / 납치협박 / 계좌이체요도 / 원격앱설치)
  - 위험도 점수 (0~100)
  - 위치 (서울 OO구)
  - 통화 경과 시간
  - 탐지 키워드 해시태그
  - 대응하기 버튼

**케이스 상세 패널 (우측 사이드)**

- 케이스 카드 클릭 시 우측 패널 표시
- 피해자 이름 / 나이 / 케이스 번호
- 피해 유형 태그 (복수 표시 가능)
- 위험도 점수 (원형 배지)
- AI 통화 분석 요약 (GPT-4o-mini가 생성한 텍스트, 불릿 리스트)
- KakaoMap 위치 표시
  - 기본: 피해자 위치 마커
  - 납치협박 유형: 보호자(아들) GPS 위치 마커 추가
  - 하단에 위치명 + 인근 경찰서 거리 표시
- 대응 프로세스 체크리스트 (스텝 형태)
  - 위치 파악 ✅
  - 가족 알림 ✅
  - 경찰 통보 ✅
  - 각 항목은 서버 WebSocket 이벤트 수신 시 순서대로 체크 처리
- 경찰 대기 상태 표시 (하드코딩: "서초경찰서 대기 중")
- 하단 액션 버튼 3개:
  - 현장 출동 지시 (UI만, 실제 동작 없음)
  - 피해자 연결 (UI만, 실제 동작 없음)
  - 사건 종료 (클릭 시 케이스 상태 완료로 변경)

<br>

### 통계 (`/statistics`)

**상단 통계 카드**

- 총 탐지 건수 + 전주 대비 증감률
- 고위험군 탐지 건수 + 전주 대비 증감률
- 계좌 동결 요청 건수 + 전주 대비 증감률

**탐지 키워드 TOP 10**

- 키워드별 탐지 횟수 가로 바 차트
- 순위 / 키워드명 / 탐지 횟수 표시
- 상세보기 링크

**연령대별 피해 현황**

- 60대 이상 집중 발생 경고 배너 (조건부 표시)
- 연령대 / 피해 건수 / 비율 테이블
- 60대 이상 행 강조 표시

**반복 탐지 전화번호 테이블**

- 전화번호 (마스킹 처리)
- 탐지 횟수
- 최근 탐지 시간
- 차단 상태 아이콘

**범인 언급 계좌 동결 현황 테이블**

- 은행명
- 계좌번호 (일부 마스킹)
- 동결 요청 시간
- 처리 상태 아이콘

<br>

## WebSocket 수신 메시지 포맷

새 케이스 수신:

```json
{
  "name": "김OO",
  "age": 71,
  "type": "기관사칭",
  "risk": 92,
  "location": "서울 강남구",
  "lat": 37.4979,
  "lng": 127.0276,
  "keywords": ["검찰 수사관", "계좌", "이체"],
  "summary": "검찰 수사관을 사칭하며 접근, 피해자 계좌가 범죄에 연루됐다고 주장, 안전계좌로 즉시 이체 요구 및 구속 협박"
}
```

툴 실행 결과 이벤트:

```json
{ "tool": "gps",    "status": "완료", "detail": "서울시 강남구" }
{ "tool": "sms",    "status": "완료", "detail": "아들(김철수)에게 알림" }
{ "tool": "police", "status": "완료", "detail": "서초경찰서 접수" }
```

<br>

## 시스템 연결 구조

```
경찰 대시보드 (Vue.js)
       │
       │ WS /ws/dashboard (항상 연결 유지)
       ▼
  Spring Boot (API Gateway)
       │ 트리거 발동 시 WebSocket 푸시
       ▼
  FastAPI + LangChain (AI 서버)
  └── 툴 실행 완료 이벤트 → Spring → 대시보드 전달
```

<br>

## 디자인 가이드

- **테마** : 다크 네이비 (`#0F172A`)
- **사이드바 배경** : `#0F172A`
- **카드 배경** : `#FFFFFF` (라이트), `#1E293B` (다크 카드)
- **포인트 컬러** :
  - 위험: `#EF4444`
  - 경고: `#F59E0B`
  - 안전: `#10B981`
  - 액센트: `#2563EB`
- **레이아웃** : 좌측 사이드바(고정) + 메인 콘텐츠 + 우측 상세 패널(조건부)
- **사이드바 메뉴** : 실시간 모니터링 / 통계 / 설정

<br>

## 디렉토리 구조

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue            # 좌측 사이드바 네비게이션
│   │   └── Header.vue             # 상단 헤더 (알림 + 유저 정보)
│   ├── dashboard/
│   │   ├── StatsBar.vue           # 상단 통계 카드
│   │   ├── CaseCard.vue           # 케이스 카드
│   │   ├── CaseDetail.vue         # 우측 상세 패널
│   │   ├── ProcessChecklist.vue   # 대응 프로세스 체크리스트
│   │   └── KakaoMap.vue           # 지도 컴포넌트
│   └── statistics/
│       ├── StatsOverview.vue      # 상단 통계 카드
│       ├── KeywordChart.vue       # 탐지 키워드 TOP 10 바 차트
│       ├── AgeTable.vue           # 연령대별 피해 현황
│       ├── RepeatCallTable.vue    # 반복 탐지 전화번호
│       └── AccountFreezeTable.vue # 계좌 동결 현황
├── composables/
│   └── useWebSocket.js            # WebSocket 연결 관리
├── stores/
│   └── cases.js                   # 케이스 상태 관리 (Pinia)
├── views/
│   ├── DashboardView.vue          # 실시간 모니터링 페이지
│   └── StatisticsView.vue         # 통계 페이지
├── router/
│   └── index.js
└── App.vue
```

<br>

## 로컬 실행

```bash
pnpm install
pnpm dev
```

### 환경 변수

```
VITE_WS_URL=ws://localhost:8080/ws/dashboard
VITE_API_URL=http://localhost:8080
VITE_KAKAO_MAP_KEY=your_kakao_map_api_key
```

<br>

---

<div align="center">
<sub>© 2025 SSAIREN Team · SSAFY 15기</sub>
</div>
