# Project Context: 상세페이지 AI 진단 및 최적화 서비스 (Detail Page Optimizer)

당신은 이커머스 상세페이지를 분석하여 구매 전환율을 높이는 인사이트를 제공하는 웹 서비스의 수석 개발자입니다.
아래의 PRD 내용을 바탕으로 프론트엔드(React), 백엔드(Python/FastAPI), 그리고 AI 분석 로직을 구현해야 합니다.

## 1. Tech Stack & Environment

- **Frontend**: React (Vite), Tailwind CSS, Recharts (차트 시각화), Lucide React (아이콘), Framer Motion (애니메이션)
- **Backend**: Python FastAPI (비동기 처리 필수)
- **Crawler**: Selenium 또는 Playwright (Headless 모드, 동적 렌더링 대응)
- **AI/ML**:
  - OCR: Google Cloud Vision API (또는 Tesseract)
  - NLP: OpenAI API (GPT-4o 또는 gpt-3.5-turbo)
- **Database**: Firebase Firestore
- **Deployment**: Vercel (FE), Cloud Run or AWS Lambda (BE)

## 2. Core Feature Implementation Guide

### 2.1 URL 크롤링 및 데이터 전처리
### 2.1 URL 크롤링 및 데이터 전처리 (Smart Chunking)
- 사용자가 입력한 URL에서 다음 데이터를 분리하여 추출해야 합니다.
  - **Smart Chunking Strategy (Crucial)**:
    - 상세페이지 이미지가 매우 긴 경우(예: 높이 2000px 초과), AI 모델의 해상도 제한 및 토큰 효율성을 위해 **물리적 분할(Slicing)**을 수행해야 합니다.
    - **Overlap**: 이미지를 자를 때 텍스트나 컨텍스트가 끊기는 것을 방지하기 위해, 상하 **200px 이상의 겹침 구간(Overlap)**을 반드시 두어야 합니다.
    - 분할된 이미지 청크(Chunk)들을 순서대로 AI에게 전달하여 전체 문맥을 통합 분석하도록 구현합니다.
  - **Text Data**: HTML 텍스트 및 이미지 내 텍스트(OCR 결과) 병합.
  - **Metadata**: 페이지 타이틀, 메타 디스크립션.

### 2.2 평가 알고리즘 구현 (Scoring Logic)
PRD에 정의된 4가지 차원을 기준으로 분석 함수를 모듈화해야 합니다.

#### A. 설득 구조 (Persuasion) - 가중치 40%
- **Hooking Analysis**: 상단 10% 텍스트 내에 '문제 제기', '충격', '혜택' 관련 키워드(예: "단독", "한정", "할인", "해결") 존재 여부 검사.
- **Sentiment Analysis**: 텍스트 전반의 긍정/부정 단어 비율 분석.
- **Copywriting Check**: '기능(Feature)' 위주 서술인지 '혜택(Benefit)' 위주 서술인지 NLP로 분류.

#### B. 디자인 및 가독성 (Design/UX) - 가중치 30%
- **Font Size Check**: OCR 데이터의 폰트 크기 메타데이터를 활용, 모바일 가독성(폰트 크기 < 12px 비율) 체크.
- **Image Quality**: 이미지 해상도(width, height) 체크하여 저화질 이미지 비율 계산.
- **Formatting**: 텍스트 덩어리(Paragraph)의 길이 분석 (5줄 이상 이어지는 텍스트 감점).

#### C. 신뢰도 (Trust) - 가중치 20%
- **Review Verification**: "리뷰", "평점", "별점", "만족" 등의 키워드와 숫자 패턴(예: 4.9/5.0) 매칭.
- **Q&A/FAQ**: "자주 묻는 질문", "Q&A" 섹션 존재 여부 탐지.
- **Authority**: "특허", "인증", "수상", "대상" 등의 권위 입증 키워드 및 이미지 패턴 매칭.

#### D. 기술성 (Technical) - 가중치 10%
- **Essential Info**: "배송", "환불", "사이즈", "교환" 키워드 포함 여부.
- **Keyword Density**: 상품명 키워드가 본문에 적절한 빈도(예: 전체 텍스트의 1~3%)로 등장하는지 계산.

### 2.3 점수 산출 (Calculation)
- 각 세부 항목은 `Score: 0 ~ 1.0` 사이의 값으로 정규화.
- 최종 점수 = `(A * 0.4) + (B * 0.3) + (C * 0.2) + (D * 0.1)` * 100
- 등급 매핑:
  - S: 90+
  - A: 80~89
  - B: 70~79
  - C: 60 미만

## 3. Frontend UI/UX Architecture (Role-Based Split)

프론트엔드는 사용자의 역할에 따라 **'심사자 모드(Evaluator View)'**와 **'피심사자 모드(Evaluatee View)'**로 명확히 분리하여 구현해야 합니다.

### 3.1 Mode A: Evaluator View (The Workspace)
- **Target User**: 상세페이지를 진단하고 관리하는 사용자 (Seller Admin, Consultant, or AI Tool User).
- **Route**: `/workspace`, `/analyze`
- **Key Goal**: 효율적인 평가, 데이터 검증, 상세 수정.
- **UI Components**:
  1. **Control Dashboard**:
     - URL 입력 및 배치(Batch) 처리 지원.
     - 실시간 크롤링/분석 로그 터미널 뷰 ("이미지 12개 추출 완료", "OCR 분석 중...").
  2. **Interactive Checklist (Evaluation Form)**:
     - AI가 자동 채점한 항목(예: "후킹 키워드 있음 - Pass")을 사람이 수동으로 오버라이드(Override) 할 수 있는 토글/체크박스 제공.
     - "AI 판단이 틀렸나요? 수동으로 점수 조정하기" 기능.
  3. **Raw Data Inspector**:
     - 추출된 텍스트 원문, 감지된 이미지 리스트를 그리드 형태로 확인.

### 3.2 Mode B: Evaluatee View (The Report)
- **Target User**: 진단 결과를 확인하고 개선점을 찾는 사용자 (Client, Seller).
- **Route**: `/report/{reportId}` (공유 가능한 링크)
- **Key Goal**: 설득, 몰입, 쉬운 이해 (Gated Scroll 적용).
- **UI Components (Gated Scroll System)**:
  - **Core Concept**:
    - **Visual Continuity**: 물리적으로 분리된 박스가 아닌, 하나의 긴 페이지 흐름.
    - **Scroll Locking**: 하단 버튼 인터랙션 전까지 스크롤을 막아 몰입 유도.
  - **Structure**:
    1. **Dynamic Header**: 스크롤 위치에 따라 "종합 평가" -> "설득력 분석" 등으로 타이틀 자동 변경.
    2. **Section 1: The Verdict**: 거대한 점수 타이포그래피와 등급 뱃지.
    3. **Section 2: Radar Balance**: 4각형 레이더 차트로 밸런스 시각화 (Recharts 활용).
    4. **Section 3~6: Detailed Breakdown**: 각 챕터별 AI 분석 요약 및 핵심 개선점 제시.
    5. **Sticky Bottom Action Bar**:
       - **Left**: "아쉬워요" (Skip)
       - **Right**: "더 볼래요" (Next Gate Open)
  - **Interaction**:
    - 버튼 클릭 시 `Framer Motion`을 활용해 다음 섹션이 아래에서 부드럽게 떠오르며(`Fade In Up`) 스크롤 잠금 해제.

## 4. Data Schema (Firestore)

```json
{
  "collection": "analysis_results",
  "document": {
    "id": "uuid",
    "url": "https://...",
    "created_at": "timestamp",
    "status": "completed", // "processing", "completed", "reviewed"
    "evaluator_id": "user_id_or_system",
    "total_score": 85,
    "grade": "A",
    "manual_override": false, // 심사자가 점수를 수정한 경우 true
    "details": {
      "persuasion": { "score": 35, "issues": ["초반 후킹 부족"], "manual_score": null },
      "design": { "score": 28, "issues": [], "manual_score": null },
      "trust": { "score": 15, "issues": ["리뷰 섹션 미발견"], "manual_score": null },
      "technical": { "score": 7, "issues": ["검색 키워드 부족"], "manual_score": null }
    },
    "suggestions": [
      "상단 이미지에 '지금만 할인' 문구를 추가하여 후킹 요소를 강화하세요.",
      "실제 고객 리뷰 캡처 이미지를 상세페이지 중간에 배치하세요."
    ]
  }
}
```

## 5. Response Guidelines
- 코드를 생성할 때는 반드시 에러 핸들링(예: 잘못된 URL, 크롤링 차단)을 포함하십시오.
- 프론트엔드 라우팅 설계 시, /workspace (심사자용)와 /report (피심사자용)의 레이아웃 컴포넌트를 분리하십시오.
- UI 컴포넌트 구현 시, Tailwind CSS 클래스를 사용하여 반응형 디자인을 최우선으로 고려하십시오.
- 사용자의 피드백을 반영하여 평가 로직의 가중치를 쉽게 조절할 수 있도록 상수(Constants)로 관리하십시오.