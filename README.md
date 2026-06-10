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
| `/login`      | 로그인          | 계정 인증                                 |
| `/`           | 실시간 모니터링 | WebSocket 기반 케이스 실시간 수신 및 대응 |
| `/statistics` | 통계            | 탐지 데이터 집계 및 분석                  |

<br>

## 기능 명세

### 실시간 모니터링 (`/`)

**상단 통계 카드 (탭 역할)**

- 위험 진행중 건수 클릭 → 진행 중 케이스 목록 표시 (빨간 테두리 활성)
- 대응 완료 건수 클릭 → 완료 케이스 목록 표시 (초록 테두리 활성)
- 평균 대응 시간 (클릭 불가)
- 건수는 실제 케이스 배열 기준 동적 표시

**케이스 목록**

- 위험 진행중: WebSocket `/ws/dashboard` 수신 케이스
- 대응 완료: DB API에서 조회한 케이스
- 탭 전환 시 첫 번째 케이스 자동 선택
- 케이스 카드 표시 정보:
  - 피해자 이름 / 나이
  - 피해 유형 태그 (기관사칭 / 납치협박 / 계좌이체요도 / 원격앱설치)
  - 위험도 점수 (0~100) 및 게이지 바
  - 위치 / 통화 경과 시간 / 탐지 키워드 해시태그
  - 진행중: 대응하기 버튼 / 완료: 완료 배지

**케이스 상세 패널 (우측 사이드, 드래그로 너비 조절 가능)**

- 케이스 카드 클릭 시 우측 패널 표시
- 피해자 이름 / 나이 / 케이스 번호
- 피해 유형 태그 (복수 표시 가능)
- 위험도 점수 (원형 배지)
- AI 통화 분석 요약 (불릿 리스트)
- KakaoMap 위치 표시 + 인근 경찰서 거리
- 대응 프로세스 체크리스트 (위치 파악 → 가족 알림 → 경찰 통보)
- 진행중 케이스 전용 표시:
  - 경찰 대응 대기중 상태 배너
  - 하단 액션 버튼: 현장 출동 지시 / 피해자 연결 / 사건 종료

<br>

### 통계 (`/statistics`)

**상단 통계 카드**

- 총 탐지 건수 + 전주 대비 증감률
- 고위험군 탐지 건수 + 전주 대비 증감률
- 계좌 동결 요청 건수 + 전주 대비 증감률

**탐지 키워드 TOP 10**

- 키워드별 탐지 횟수 가로 바 차트

**연령대별 피해 현황**

- 60대 이상 집중 발생 경고 배너 (조건부 표시)
- 연령대 / 피해 건수 / 비율 테이블

**반복 탐지 전화번호 / 계좌 동결 현황 테이블**

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
- **카드 배경** : `#FFFFFF`
- **포인트 컬러** :
  - 위험: `#EF4444`
  - 경고: `#F59E0B`
  - 안전: `#10B981`
  - 액센트: `#2563EB`
- **레이아웃** : 좌측 사이드바(고정) + 메인 콘텐츠 + 우측 상세 패널(조건부)
- **사이드바 메뉴** : 실시간 모니터링 / 통계

<br>

## 디렉토리 구조

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue            # 좌측 사이드바 네비게이션
│   │   └── Header.vue             # 상단 헤더 (유저 정보 + 로그아웃)
│   └── dashboard/
│       ├── StatsBar.vue           # 상단 통계 카드 (탭 필터 역할)
│       ├── CaseCard.vue           # 케이스 카드
│       └── CaseDetail.vue         # 우측 상세 패널
├── stores/
│   └── auth.js                    # 인증 상태 관리 (Pinia)
├── views/
│   ├── LoginView.vue              # 로그인 페이지
│   ├── DashboardView.vue          # 실시간 모니터링 페이지
│   └── StatisticsView.vue         # 통계 페이지
├── router/
│   └── index.js
└── App.vue
```

> **미구현 (연동 예정)**  
> `composables/useWebSocket.js` — WebSocket 연결 관리  
> `stores/cases.js` — 케이스 상태 관리

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
