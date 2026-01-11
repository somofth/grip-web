# 상세페이지 AI 최적화 서비스 백엔드 API 명세서

본 문서는 프론트엔드(Client)와 백엔드(Server) 간의 협업을 위한 API 요구사항 정의서입니다.
서비스의 핵심 기능인 **상세페이지 크롤링, 이미지 클러스터링(섹션 분리), 그리고 AI 질문/보기 생성** 로직을 포함합니다.

---

## 1. 공통 사항

- **Host**: `https://api.example.com/v1` (예시)
- **Format**: JSON
- **Auth**: Bearer Token (필요 시)

---

## 2. 핵심 데이터 모델 (Types)

### 2.1 Section (상세페이지 섹션)
상세페이지를 논리적인 단위(섹션)로 쪼갠 결과물입니다.
```typescript
interface Section {
  id: number;           // 섹션 순서 (1, 2, 3...)
  title: string;        // 섹션 제목 (예: "도입부 및 문제 제기")
  goal: string;         // 섹션의 목표 (예: "공감 유도")
  reason: string;       // AI가 이 섹션을 이렇게 분류한 논리적 근거
  images: string[];     // 해당 섹션에 포함된 이미지 URL 리스트
  questions: Question[]; // 해당 섹션에 추천되는 질문 리스트
}
```

### 2.2 Question (질문 및 보기)
각 섹션에 대해 유저에게 던질 질문과 답변 형식입니다.
```typescript
interface Question {
  id: string;
  text: string;                 // 질문 내용 (예: "이 제품이 얼마나 튼튼해 보이나요?")
  type: 'rating' | 'choice' | 'text'; // 질문 유형 (별점, 객관식, 주관식)
  logic: string;                // 이 질문을 추천한 이유 (AI Insight)
  options?: Option[];           // 객관식일 경우 보기 리스트
}

interface Option {
  emoji: string; // 보기 앞 이모지 (예: "💪")
  text: string;  // 보기 텍스트 (예: "탱크급: 절대 안 부서질 것 같아요.")
}
```

---

## 3. API 상세 요구사항

### 3.1 [POST] 상세페이지 전체 분석 및 초기 설정
유저가 URL을 입력했을 때 호출되는 가장 무거운 API입니다. 크롤링부터 섹션 분리, 추천 질문 생성까지 **한 번에(혹은 비동기 Job으로)** 처리합니다.

- **Endpoint**: `/analyze/page`
- **Request**:
```json
{
  "url": "https://smartstore.naver.com/...", // 분석할 상세페이지 URL
  "target_audience": { // (선택) 타겟 정보가 있다면 더 정교한 질문 생성 가능
    "gender": "female",
    "age": ["20s", "30s"],
    "category": "fashion"
  }
}
```

- **Process (Backend)**:
  1. **Crawling**: URL의 전체 이미지를 순서대로 크롤링 (Text 크롤링 포함).
  2. **Clustering (AI)**:
     - 이미지를 위에서부터 분석하여 **문맥(Context)**이 바뀌는 지점을 기준으로 자릅니다.
     - 예: "인트로(사용자 고민)" -> "제품 스펙(솔루션)" -> "리뷰/신뢰도" -> "옵션/가격".
     - **목표**: 4~5개의 핵심 섹션으로 그룹화.
  3. **Question Gen (AI)**:
     - 각 섹션의 이미지 내용을 바탕으로, **소비자가 긍정/부정을 느낄만한 포인트**를 찾아 질문을 생성합니다.
     - *중요*: 질문은 기본적으로 `rating`(별점) 형으로 생성하되, 구체적인 확인이 필요한 경우 `choice`(객관식)형을 섞어주세요.

- **Response**:
```json
{
  "status": "success",
  "product_info": {
     "name": "OOO 튼튼 책상",
     "thumbnail": "https://..."
  },
  "sections": [
    {
      "id": 1,
      "title": "도입 및 필요성 인식",
      "goal": "공간 활용 문제 공감 유도",
      "reason": "책상이 지저분한 사진들이 연속되어, 고객의 페인 포인트를 자극하는 구간입니다.",
      "images": ["url1.jpg", "url2.jpg"],
      "questions": [
        {
           "id": "q1_1",
           "text": "이 사진을 보자마자 내 방 이야기 같아서 클릭하고 싶어지나요?",
           "type": "rating",
           "logic": "초반 3초 이탈률을 방어하기 위한 '공감도' 체크 질문입니다."
        }
      ]
    },
    // ... Section 2, 3, 4
  ]
}
```

---

### 3.2 [POST] 단일 질문 최적화 및 보기 생성 (Real-time)
프론트엔드에서 사용자가 "질문 유형"을 `Choice`(객관식)으로 변경하거나, 질문 텍스트를 수정했을 때 **적절한 4지선다 보기를 생성**해주는 API입니다.

- **Endpoint**: `/questions/optimize`
- **Request**:
```json
{
  "section_context": "내구성 테스트 및 인증", // 섹션 정보
  "original_question": "이 제품 튼튼해 보여?", // 사용자가 대충 입력한 질문
  "target_type": "choice" // 변환할 목표 타입
}
```

- **Process (Backend)**:
  1. **Rephrasing**: 사용자의 구어체 질문을 "설문 조사에 적합한 깔끔한 문장"으로 다듬습니다.
  2. **Option Gen**: 답변 스펙트럼(매우 긍정/긍정/중립/부정)에 맞춰 4개의 재치 있는 보기를 생성합니다.

- **Response**:
```json
{
  "rephrased_question": "상세페이지의 내구성 테스트 움짤을 봤을 때, 제품의 튼튼함이 얼마나 신뢰가 가나요?",
  "options": [
    { "emoji": "💪", "text": "탱크급: 사람이 올라가도 끄떡없을 것 같아요." },
    { "emoji": "✅", "text": "튼튼함: 일상 생활에서 쓰기에 충분해 보여요." },
    { "emoji": "🤔", "text": "글쎄요: 튼튼해 보이긴 한데 실제로는 어떨지 모르겠어요." },
    { "emoji": "🎋", "text": "부실함: 무거운 걸 올리면 휘거나 부러질 것 같아요." }
  ]
}
```

---

### 3.3 [POST] 가상 결과 시뮬레이션 (Mock Data Gen)
대시보드(Mode 3)에서 보여줄 **가상 데이터**를 생성합니다. 테스트 단계에서 실제 유저 반응이 없어도 미리보기를 제공하기 위함입니다.

- **Endpoint**: `/simulate/result`
- **Request**:
```json
{
  "question": {
      "text": "가격이 합리적인가요?",
      "type": "choice",
      "options": [...] 
  }
}
```

- **Response**:
```json
{
  "insight": {
    "status": "warning", // good, warning, critical
    "text": "가격 대비 성능에는 만족하지만, 배송비 포함 시 비싸다는 의견이 30% 존재합니다."
  },
  "data": {
    "distribution": [
       { "name": "매우 만족", "value": 45 },
       { "name": "보통", "value": 25 },
       // ...
    ]
  }
}
```
