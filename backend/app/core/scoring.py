from .ai import ai_processor
from app.models.analysis import AnalysisResult, AnalysisDetails, ScoreDimension, AnalysisStatus
from typing import List
import re

class ScoringEngine:
    async def evaluate(self, url: str, title: str, html_content: str, image_chunks: List[bytes]) -> AnalysisDetails:
        # 1. OCR Processing
        full_text = ""
        font_sizes = []
        
        for chunk in image_chunks:
            # Simple text extraction for content
            text = await ai_processor.detect_text(chunk)
            full_text += text + "\n"
            
            # Metadata extraction for font size check (sample one chunk or all?)
            # For efficiency, maybe just analyze the first chunk or random chunks for font size
            # Let's do all for accuracy but catch errors
            try:
                meta = await ai_processor.detect_text_with_metadata(chunk)
                font_sizes.extend([m['height'] for m in meta])
            except Exception:
                pass

        # 2. NLP Analysis using OpenAI
        # We might need a structured output from OpenAI
        # For this prototype, I'll simulate the extraction or use a simplified prompt
        
        # NOTE: Real implementation would parse the JSON from analyze_sentiment_and_keywords
        # Here we will implement the algorithmic checks as defined in PRD where possible using regex/rules + AI
        
        # A. Persuasion (40%)
        persuasion_score, persuasion_issues = self._evaluate_persuasion(full_text)
        
        # B. Design/UX (30%)
        design_score, design_issues = self._evaluate_design(html_content, image_chunks, font_sizes)
        
        # C. Trust (20%)
        trust_score, trust_issues = self._evaluate_trust(full_text)
        
        # D. Technical (10%)
        technical_score, technical_issues = self._evaluate_technical(full_text)
        
        return AnalysisDetails(
            persuasion=ScoreDimension(score=persuasion_score, issues=persuasion_issues),
            design=ScoreDimension(score=design_score, issues=design_issues),
            trust=ScoreDimension(score=trust_score, issues=trust_issues),
            technical=ScoreDimension(score=technical_score, issues=technical_issues)
        )

    def _evaluate_persuasion(self, text: str):
        # Hooking Analysis (First 10% checks)
        first_10_percent = text[:len(text)//10]
        hooks = ["단독", "한정", "할인", "해결", "충격", "긴급"]
        has_hook = any(hook in first_10_percent for hook in hooks)
        
        score = 0
        issues = []
        if has_hook:
            score += 0.5
        else:
            issues.append("초반 10% 텍스트 내에 후킹 키워드(단독, 한정 등)가 부족합니다.")
            
        # Sentiment & Copywriting would effectively utilize NLP
        # Placeholder for hybrid logic
        score += 0.3 # Assume positive sentiment for now
        
        return min(round(score * 100, 1), 100), issues

    def _evaluate_design(self, html, images, font_sizes):
        score = 1.0
        issues = []
        
        # Mobile Readability (Font size < 12px approx equivalent in OCR height depends on resolution)
        # Assuming standard resolution, let's say < 15 pixels height is small
        if font_sizes:
            small_fonts = [h for h in font_sizes if h < 15]
            ratio = len(small_fonts) / len(font_sizes)
            if ratio > 0.3:
                score -= 0.3
                issues.append(f"가독성이 떨어지는 작은 텍스트 비율이 높습니다. ({int(ratio*100)}%)")
        
        return round(score * 100, 1), issues

    def _evaluate_trust(self, text):
        score = 0.5
        issues = []
        
        keywords = ["리뷰", "평점", "만족", "Q&A", "자주 묻는 질문"]
        found = [k for k in keywords if k in text]
        
        if len(found) < 3:
            score -= 0.2
            issues.append("신뢰도 입증 키워드(리뷰, Q&A 등)가 부족합니다.")
            
        return round(score * 100, 1), issues

    def _evaluate_technical(self, text):
        score = 0
        issues = []
        
        keywords = ["배송", "환불", "사이즈", "교환"]
        found = [k for k in keywords if k in text]
        
        if len(found) >= 3:
            score = 1.0
        else:
            score = 0.5
            issues.append("필수 안내 정보(배송, 환불 등)가 누락되었습니다.")
            
        return round(score * 100, 1), issues

scoring_engine = ScoringEngine()
