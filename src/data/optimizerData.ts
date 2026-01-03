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

export const DUMMY_SECTIONS = [
  { 
    id: 1, 
    title: "도입 및 필요성 인식", 
    goal: "공간 활용 문제 공감 유도",
    reason: "고객이 현재 겪는 불편함(좁은 공간 등)을 시각적으로 자극하여, 제품이 '나에게 필요한 솔루션'임을 인식하게 만드는 도입부입니다.",
    images: ["/detailshots/01.jpg", "/detailshots/03.jpg"],
    color: "from-blue-50 to-white",
    questions: [
      { id: "q1_1", text: "메인 이미지가 시선을 끌고 호기심을 자극하나요?" },
      { id: "q1_2", text: "지저분한 책상 상황이 당신의 상황과 공감이 가나요?" }
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
      { id: "q2_1", text: "두꺼운 상판과 프레임이 튼튼할 것이라는 확신을 주나요?" },
      { id: "q2_2", text: "하중 테스트가 내구성을 증명하기에 충분한가요?" }
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
      { id: "q3_1", text: "넓은 상판이 당신의 생활 패턴에 유용해 보이나요?" },
      { id: "q3_2", text: "E0 친환경 등급 정보가 안심을 주나요?" }
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
      { id: "q4_1", text: "핵심 장점들이 한눈에 잘 들어오나요?" },
      { id: "q4_2", text: "구매에 필요한 사이즈/소재 정보가 명확한가요?" }
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
