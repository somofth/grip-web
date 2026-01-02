from google.cloud import vision
from openai import AsyncOpenAI
from .config import settings
import asyncio
from typing import List, Dict
import os

# Set credentials env if not set, though best practice is to set it in the shell environment
if settings.GOOGLE_APPLICATION_CREDENTIALS:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_APPLICATION_CREDENTIALS

class AIProcessor:
    def __init__(self):
        self.vision_client = vision.ImageAnnotatorClient()
        self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    async def detect_text(self, image_content: bytes) -> str:
        image = vision.Image(content=image_content)
        
        # Run synchronous Vision API in a separate thread
        def _detect():
            response = self.vision_client.text_detection(image=image)
            if response.error.message:
                raise Exception(f'{response.error.message}')
            texts = response.text_annotations
            if texts:
                return texts[0].description
            return ""

        return await asyncio.to_thread(_detect)

    async def detect_text_with_metadata(self, image_content: bytes) -> List[Dict]:
        image = vision.Image(content=image_content)
        
        def _detect():
            response = self.vision_client.text_detection(image=image)
            texts = response.text_annotations
            if not texts:
                return []
            
            # texts[0] is the whole text, subsequent are individual words/blocks with vertices
            results = []
            for text in texts[1:]:
                # Extract simplified metadata (e.g., height for font size estimation)
                vertices = text.bounding_poly.vertices
                height = abs(vertices[3].y - vertices[0].y) if len(vertices) >= 4 else 0
                results.append({
                    "text": text.description,
                    "height": height
                })
            return results

        return await asyncio.to_thread(_detect)

    async def analyze_sentiment_and_keywords(self, text: str) -> dict:
        prompt = f"""
        Analyze the following e-commerce product detail page text for:
        1. Hooking keywords (Problem, Shock, Benefit) in the first 10% (approx).
        2. Overall sentiment (Positive/Negative ratio).
        3. Copywriting style: Feature-focused vs Benefit-focused.
        4. Trust signals: Reviews, Q&A, Authority (Patents, Awards).
        5. Technical info: Shipping, Refund, Size, Exchange.
        
        Text:
        {text[:10000]} # Limit text to avoid token limits, smart chunking handles this better usually but for now trigger on merged text
        """
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert e-commerce analyst."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" } 
        )
        return response.choices[0].message.content

ai_processor = AIProcessor()
