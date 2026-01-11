export const LOADING_MESSAGES = {
  crawling: "상세페이지 크롤링 중...",
  analyzing: "이미지 구조 분석 및 진단 중...",
  segmenting: "문맥별 섹션 분리 중...",
};

export const MODE_LABELS = {
  1: "분석 시뮬레이션",
  2: "소비자 반응 테스트 (모바일)",
  3: "판매자 대시보드 (AI 리포트)",
};

export const AI_QUESTION_SUGGESTIONS: Record<string, { rephrased: string, options: { emoji: string, text: string }[] }> = {
  "q1_1": {
    rephrased: "이 사진을 보자마자 '어, 이거 뭐지?' 하고 클릭해보고 싶은 마음이 드나요?",
    options: [
      { emoji: "🤩", text: "와, 대박!: 썸네일만 봐도 홀린 듯이 클릭할 것 같아요." },
      { emoji: "👀", text: "눈길이 감: 궁금해서 한 번쯤 눌러볼 것 같아요." },
      { emoji: "😐", text: "쏘쏘: 다른 제품이랑 비슷해서 그냥 지나칠 것 같아요." },
      { emoji: "🥱", text: "지루함: 너무 평범해서 전혀 눈길이 안 가요." }
    ]
  },
  "q1_2": {
    rephrased: "이 '지저분한 책상' 사진을 보고, 남 일 같지 않다고 느끼셨나요?",
    options: [
      { emoji: "🤦‍♂️", text: "소름돋음: 완전 제 방인 줄 알았어요. 격하게 공감돼요." },
      { emoji: "🤔", text: "비슷함: 저 정도는 아니지만, 어느 정도 제 상황과 비슷해요." },
      { emoji: "🙄", text: "글쎄요: 저는 평소에 정리를 잘 해서 별로 공감 안 돼요." },
      { emoji: "🤷‍♂️", text: "전혀: 제 상황과는 너무 달라서 딴 세상 얘기 같아요." }
    ]
  },
  "q2_1": {
    rephrased: "상판과 프레임 사진을 봤을 때, 이 책상이 얼마나 튼튼할 것 같나요?",
    options: [
      { emoji: "💪", text: "탱크급: 무거운 거 잔뜩 올려도 절대 안 휘어질 것 같아요." },
      { emoji: "🧱", text: "탄탄함: 일상적으로 쓰기엔 충분히 튼튼해 보여요." },
      { emoji: "🍃", text: "불안함: 무거운 모니터 올리면 살짝 휄 것 같아 보여요." },
      { emoji: "🎋", text: "부실함: 툭 치면 부러질 것 같아서 못 쓰겠어요." }
    ]
  },
  "q2_2": {
    rephrased: "하중 테스트 움짤을 보고, '아, 진짜 튼튼하구나'라고 믿음이 생겼나요?",
    options: [
      { emoji: "🛡️", text: "신뢰도 200%: 사람이 올라가도 끄떡없는 거 보고 안심했어요." },
      { emoji: "✅", text: "믿음직: 테스트 결과가 있으니까 믿고 쓸 수 있겠어요." },
      { emoji: "🧐", text: "반신반의: 테스트는 했지만, 실제로 오래 써봐야 알 것 같아요." },
      { emoji: "📉", text: "의심됨: 테스트 조건이 좀 애매해서 별로 신뢰가 안 가요." }
    ]
  },
  "q3_1": {
    rephrased: "넓은 상판이 당신의 실제 작업/공부 환경에 얼마나 도움이 될 것 같나요?",
    options: [
      { emoji: "🚀", text: "생산성 폭발: 듀얼 모니터에 책까지 펴도 남을 것 같아요." },
      { emoji: "👍", text: "유용함: 지금 쓰는 책상보다는 훨씬 편할 것 같아요." },
      { emoji: "✋", text: "딱히: 저는 책상 넓이는 별로 중요하게 안 봐요." },
      { emoji: "😖", text: "부담됨: 너무 커서 방에 두기에 좀 벅찰 것 같아요." }
    ]
  },
  "q3_2": {
    rephrased: "E0 친환경 등급이라는 점이 구매 결정에 얼마나 큰 영향을 주나요?",
    options: [
      { emoji: "🌿", text: "필수 조건: 아토피/냄새 때문에 E0 아니면 절대 안 사요." },
      { emoji: "😌", text: "안심됨: 건강 생각하면 당연히 등급 높은 게 좋죠." },
      { emoji: "😐", text: "참고만: 좋긴 한데, 가격이 더 중요하다면 포기할 수 있어요." },
      { emoji: "💨", text: "관심 없음: 냄새 좀 나도 싼 게 최고예요." }
    ]
  },
  "q4_1": {
    rephrased: "지금까지 본 제품의 핵심 장점들이 머릿속에 쏙쏙 들어왔나요?",
    options: [
      { emoji: "🧠", text: "뇌리에 박힘: 장점 3가지가 바로 딱 떠올라요." },
      { emoji: "👌", text: "이해 완료: 전반적으로 어떤 게 좋은지 알겠어요." },
      { emoji: "😵", text: "가물가물: 좋은 건 알겠는데, 구체적으로 뭐가 좋았더라?" },
      { emoji: "☁️", text: "기억 안 남: 그냥 스크롤만 내리느라 내용은 잘 모르겠어요." }
    ]
  },
  "q4_2": {
    rephrased: "당장 이 제품을 구매한다고 했을 때, 사이즈나 소재 정보가 충분한가요?",
    options: [
        { emoji: "🛒", text: "결제 준비 끝: 필요한 정보가 다 있어서 바로 살 수 있어요." },
        { emoji: "📏", text: "충분함: 사이즈랑 소재는 다 확인했고, 고민만 좀 더 해볼래요." },
        { emoji: "🚧", text: "2% 부족: 설치 공간 관련해서 조금 더 자세한 정보가 필요해요." },
        { emoji: "🚫", text: "정보 부족: 상세 사이즈 표가 어디 있는지 못 찾겠어요." }
    ]
  }
};

export const DUMMY_SECTIONS = [
  { 
    id: 1, 
    title: "도입 및 필요성 인식", 
    goal: "공간 활용 문제 공감 유도",
    reason: "고객이 현재 겪는 불편함(좁은 공간 등)을 시각적으로 자극하여, 제품이 '나에게 필요한 솔루션'임을 인식하게 만드는 도입부입니다.",
    images: ["/detailshots/01.jpg", "/detailshots/03.jpg"],
    color: "from-blue-50 to-white",
    questions: [
      { id: "q1_1", text: "메인 이미지가 시선을 끌고 호기심을 자극하나요?", logic: "방문 후 3초 이내에 이탈률이 가장 높으므로, 시각적 호기심 자극이 필수적입니다.", type: 'rating' },
      { id: "q1_2", text: "지저분한 책상 상황이 당신의 상황과 공감이 가나요?", logic: "고객의 페인 포인트(Pain Point)를 건드려 문제 해결 욕구를 불러일으키기 위함입니다.", type: 'rating' }
    ]
  },
  { 
    id: 2, 
    title: "핵심 내구성 및 신뢰도", 
    goal: "튼튼한 내구성 입증",
    reason: "온라인 가구 구매의 최대 장벽인 '내구성 불신'을 해소하기 위해, 두꺼운 상판과 하중 테스트 등 객관적 증거를 제시하는 신뢰 구축 단계입니다.",
    images: ["/detailshots/06.jpg", "/detailshots/07.jpg", "/detailshots/08.jpg"],
    color: "from-gray-50 to-white",
    questions: [
      { 
        id: "q2_1", 
        text: "두꺼운 상판과 프레임이 튼튼할 것이라는 확신을 주나요?", 
        logic: "제품의 물리적 스펙을 시각적으로 강조하여 신뢰도를 높이는 전략입니다.", 
        type: 'choice',
        options: [
          { emoji: "💪", text: "탱크급: 무거운 거 잔뜩 올려도 절대 안 휘어질 것 같아요." },
          { emoji: "🧱", text: "탄탄함: 일상적으로 쓰기엔 충분히 튼튼해 보여요." },
          { emoji: "🍃", text: "불안함: 무거운 모니터 올리면 살짝 휄 것 같아 보여요." },
          { emoji: "🎋", text: "부실함: 툭 치면 부러질 것 같아서 못 쓰겠어요." }
        ]
      },
      { id: "q2_2", text: "하중 테스트가 내구성을 증명하기에 충분한가요?", logic: "객관적인 테스트 데이터는 소비자의 불안감을 해소하는 가장 강력한 장치입니다.", type: 'rating' }
    ]
  },
  { 
    id: 3, 
    title: "사용성 및 안전성 디테일", 
    goal: "실사용 이점과 안전 소재 강조",
    reason: "실제 사용 환경에서의 이점(넓은 작업공간)과 소재의 안전성(E0 등급)을 보여주어, 실용적인 구매 동기를 강화하는 단계입니다.",
    images: ["/detailshots/04.jpg", "/detailshots/05.jpg"],
    color: "from-emerald-50 to-white",
    questions: [
      { 
        id: "q3_1", 
        text: "넓은 상판이 당신의 생활 패턴에 유용해 보이나요?", 
        logic: "단순한 기능 설명을 넘어, 고객의 라이프스타일에 맞춘 이점을 제시해야 합니다.", 
        type: 'choice',
        options: [
          { emoji: "🚀", text: "생산성 폭발: 듀얼 모니터에 책까지 펴도 남을 것 같아요." },
          { emoji: "👍", text: "유용함: 지금 쓰는 책상보다는 훨씬 편할 것 같아요." },
          { emoji: "✋", text: "딱히: 저는 책상 넓이는 별로 중요하게 안 봐요." },
          { emoji: "😖", text: "부담됨: 너무 커서 방에 두기에 좀 벅찰 것 같아요." }
        ]
      },
      { 
        id: "q3_2", 
        text: "E0 친환경 등급 정보가 안심을 주나요?", 
        logic: "건강과 안전에 민감한 타깃층에게 필수적인 구매 결정 요인입니다.", 
        type: 'choice',
        options: [
          { emoji: "🌿", text: "필수 조건: 아토피/냄새 때문에 E0 아니면 절대 안 사요." },
          { emoji: "😌", text: "안심됨: 건강 생각하면 당연히 등급 높은 게 좋죠." },
          { emoji: "😐", text: "참고만: 좋긴 한데, 가격이 더 중요하다면 포기할 수 있어요." },
          { emoji: "💨", text: "관심 없음: 냄새 좀 나도 싼 게 최고예요." }
        ]
      }
    ]
  },
  { 
    id: 4, 
    title: "정보 요약 및 최종 확인", 
    goal: "스펙 확인 및 구매 유도",
    reason: "앞서 소구한 핵심 포인트를 요약하고, 사이즈/소재 등 필수 정보를 명확히 전달하여 최종 구매 결정을 돕는 마무리 단계입니다.",
    images: ["/detailshots/02.jpg", "/detailshots/09.jpg"],
    color: "from-indigo-50 to-white",
    questions: [
      { id: "q4_1", text: "핵심 장점들이 한눈에 잘 들어오나요?", logic: "이탈 직전 마지막으로 구매 욕구를 상기시키는 요약(Recap) 과정입니다.", type: 'rating' },
      { id: "q4_2", text: "이 제품 구매를 망설이게 하는 이유가 있다면 무엇인가요?", logic: "구매 결정 단계에서의 불확실성을 제거하여 전환율을 높이기 위함입니다.", type: 'text' }
    ]
  },
];

export const METRICS_DATA = [
  { name: '1주차', bounceRate: 65, optimized: 64 },
  { name: '2주차', bounceRate: 62, optimized: 60 },
  { name: '3주차', bounceRate: 58, optimized: 45 }, // Drop after optimization
  { name: '4주차', bounceRate: 55, optimized: 35 },
];

export const DWELL_TIME_DATA = [
  { section: '도입부', before: 5, after: 8 },
  { section: '특징', before: 12, after: 18 },
  { section: '신뢰도', before: 3, after: 12 }, // Big jump
  { section: '가이드', before: 8, after: 10 },
];
