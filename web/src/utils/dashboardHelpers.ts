import type { Question, DashboardResult } from "../types";

export const generateMockResult = (q: Question): DashboardResult => {
    // Deterministic pseudo-random based on string length to keep demo consistent
    const seed = q.text.length; 
    
    if (q.type === 'choice' && q.options) {
        // Generate distribution for provided options
        const total = 100;
        let remaining = total;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const distribution = q.options.map((opt, i) => {
            // Skew towards first options (usually positive in our data)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const val = i === q.options!.length - 1 ? remaining : Math.floor(remaining * (0.6 - i * 0.1));
            remaining -= val;
            return {
                name: opt.emoji + " " + opt.text.split(':')[0], // Shorten text for chart
                value: val < 0 ? 5 : val, // Fallback safety
                color: i === 0 ? '#3182F6' : i === 1 ? '#9CA3AF' : '#EF4444' // Blue -> Gray -> Red gradient approx
            };
        });
        return { distribution };
    } else if (q.type === 'text') {
        return {
            keywords: ["가격", "디자인", "배송"].sort(() => 0.5 - Math.random()),
            summary: "사용자들은 전반적으로 긍정적이나, 일부 옵션 선택 과정에서 혼란을 겪었다고 언급했습니다."
        };
    } else {
        // Rating default
        return { score: (seed % 20) / 10 + 3.0 }; // Returns 3.0 ~ 4.9
    }
};

export const generateInsight = (q: Question, score?: number): { text: string, status: 'good' | 'warning' | 'critical' } => {
    if (q.type === 'text') {
        return { text: "주관식 응답 분석 결과, '배송'과 관련된 키워드가 40% 이상 등장했습니다. 상세페이지 내 배송 안내를 보강히세요.", status: 'warning' };
    }
    
    // Logic based on random score or passed score
    const safeScore = score || 4.0;
    
    if (safeScore >= 4.0) {
        return { text: "매우 긍정적인 반응입니다! 이 섹션은 구매 전환에 크게 기여하고 있습니다. 현재 상태를 유지하세요.", status: 'good' };
    } else if (safeScore >= 3.0) {
        return { text: "평이한 수준입니다. 유저 30%가 이 부분에서 스크롤 속도가 빨라졌습니다. 가독성을 높여보세요.", status: 'warning' };
    } else {
        return { text: "이탈 위험이 높습니다 (Critical). 유저들이 이 질문에 대해 부정적인 반응을 보였습니다. 즉시 수정이 필요합니다.", status: 'critical' };
    }
};
