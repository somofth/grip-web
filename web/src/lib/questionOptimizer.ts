import { Question } from "../types";

// Types matching the markdown prompts
export type QuestionType = 'rating' | 'choice' | 'text';

export interface ClassificationResult {
  id: string; // or number, keeping basic ID
  original_intent?: string;
  question: string;
  type: QuestionType;
  priority?: 'high' | 'medium' | 'low';
}

export interface OptimizationResult {
  original_intent: string;
  rephrased_question: string;
  options: {
    emoji: string;
    keyword: string;
    text: string;
  }[];
}

/**
 * [API Simulation]
 * Generates the system prompt for Question Classification based on 'questionselect.md'.
 */
const generateClassificationPrompt = (questions: { id: string | number; text: string }[], context?: string) => {
  return `
# Role
당신은 모바일 앱 사용자 경험(UX) 최적화 전문가이자 **설문 설계 아키텍트**입니다.
주어진 질문 리스트를 분석하여, 사용자의 응답 피로도를 최소화하면서도 양질의 데이터를 얻을 수 있도록 **최적의 답변 형식(Type)**을 결정하고 분류하세요.

# Input Data
- 문맥: ${context || '일반 쇼핑몰 상세페이지'}
- 질문 리스트:
${questions.map(q => `- [${q.id}] ${q.text}`).join('\n')}

# Classification Rules (Logic)
각 질문을 분석하여 다음 3가지 유형 중 하나로 분류하세요.

## 1. ⭐ 별점형 (Rating)
- **조건:** 직관적인 감정, 전반적인 만족도, 신뢰도 등 '정도(Degree)'를 묻는 질문.
- **특징:** 가장 피로도가 낮음. 우선적으로 고려할 것.

## 2. 🔘 보기형 (Choice)
- **조건:** 구체적인 속성(사이즈, 재질, 가독성 등)을 판단해야 하거나, 명확한 선택지가 필요한 질문.
- **특징:** 구체적인 데이터를 얻기에 가장 적합함.

## 3. 📝 서술형 (Text)
- **조건:** 사용자의 구체적인 '이유(Why)'나 '개선 아이디어'를 묻는 경우. 또는 복합적인 의견이 필요한 경우.
- **제약 사항 (Critical):** 전체 질문 리스트 중 **최대 1~2개**만 이 유형으로 할당하세요.

# Task Instructions
1. 입력된 질문의 의도를 파악하세요.
2. 위 규칙에 따라 type을 결정하세요 (rating, choice, text).
3. 질문의 문구(question)를 모바일 환경에 맞게 다듬으세요.

# Output Format (JSON)
결과는 오직 JSON 배열(Array) 형태로만 출력하세요.
`;
};

/**
 * [API Simulation]
 * Generates the system prompt for Question Optimization (Rephrasing + Options) based on 'questionchange.md'.
 */
const generateOptimizationPrompt = (question: string, context?: string) => {
  return `
# Role
당신은 이탈률 분석 서비스 'Grip'의 **UX 리서치 설계 전문가**입니다.
쇼핑몰 사장님이 작성한 '투박한 초안 질문'을 입력받아, 앱테크 유저들이 직관적으로 반응할 수 있는 **'고품질 객관식(보기형) 질문 세트'**로 변환하는 것이 당신의 임무입니다.

# Input Data
- 사장님의 원본 질문: "${question}"
- 문맥: ${context || "상세페이지 분석"}

# Task Instructions
입력된 질문을 분석하여 다음 2가지 요소를 생성하세요.

## 1. 질문 리프레이밍 (Rephrasing)
- **Yes/No 금지:** 답변이 "네/아니요"로 끝나는 폐쇄형 질문을 피하세요.
- **감각/판단 유도:** 유저의 '느낌', '생각', '판단'을 묻는 개방형 질문으로 수정하세요.
- **톤앤매너:** 구어체로 부드럽게, 하지만 명확하게 작성하세요.
  - *Bad:* "내구성이 우수한가요?"
  - *Good:* "이 사진을 봤을 때, 제품이 얼마나 튼튼해 보이나요?"

## 2. 보기 생성 (Option Generation)
- **4지 선다:** 답변 보기는 반드시 4개를 생성하세요.
- **스펙트럼:** [매우 긍정] - [약간 긍정/중립] - [약간 부정/우려] - [매우 부정/치명적] 스펙트럼을 커버해야 합니다.
- **포맷:** 각 보기는 **"이모지 + 핵심 키워드 + 구체적인 이유"** 형태로 구성하세요.
  - 예: "💪 탱크급: 무거운 걸 올려도 끄떡없을 것 같아요."
- **유저 언어:** 전문 용어 대신, 실제 소비자가 친구에게 말하는 듯한 표현을 사용하세요. (예: 혜자, 찰떡, 싼티 등)

# Output Format (JSON)
결과는 반드시 아래의 JSON 형식으로만 출력하세요.
`;
};

/**
 * [Mock API]
 * Simulates calling an LLM to classify a list of questions.
 * In a real app, this would use `fetch` to send the `generateClassificationPrompt` result to a backend/OpenAI.
 */
export const classifyQuestions = async (questions: { id: string | number; text: string }[], context?: string): Promise<ClassificationResult[]> => {
  console.log('[Mock API] Generating Classification Prompt:', generateClassificationPrompt(questions, context));
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock implementation matching current dummy data logic
  return questions.map(q => {
    let type: QuestionType = 'rating';
    if (q.text.includes("튼튼") || q.text.includes("유용") || q.text.includes("안심")) type = 'choice';
    if (q.text.includes("이유") || q.text.includes("망설")) type = 'text';
    
    // Override based on some keywords for demo consistency if needed
    // This is just a heuristic mock
    return {
      id: String(q.id),
      question: q.text, // In real API, this would be the refined text
      original_intent: "Mock Intent",
      type: type,
      priority: 'medium'
    };
  });
};

/**
 * [Mock API]
 * Simulates calling an LLM to optimize a specific 'choice' question.
 * In a real app, this would use `fetch` to send the `generateOptimizationPrompt` result to a backend/OpenAI.
 */
export const optimizeQuestion = async (question: string, context?: string): Promise<OptimizationResult> => {
  console.log('[Mock API] Generating Optimization Prompt:', generateOptimizationPrompt(question, context));

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Mock response (Dynamic-ish fallback)
  return {
    original_intent: "Optimization",
    rephrased_question: `[AI Rephrased] ${question}`,
    options: [
      { emoji: "😍", keyword: "완벽해요", text: "더 바랄 게 없이 딱 좋아요." },
      { emoji: "🙂", keyword: "괜찮아요", text: "나쁘지 않지만 조금 아쉬워요." },
      { emoji: "🤔", keyword: "글쎄요", text: "뭔가 좀 애매한 것 같아요." },
      { emoji: "😱", keyword: "별로예요", text: "기대했던 것과는 많이 달라요." }
    ]
  };
};
