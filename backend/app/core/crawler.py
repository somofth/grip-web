import asyncio
from playwright.async_api import async_playwright
from PIL import Image
import io
from typing import List

class Crawler:
    def __init__(self):
        self.chunk_size = 2000
        self.overlap = 200

    async def crawl(self, url: str) -> dict:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, wait_until="networkidle")
            
            # Get textual data
            content = await page.content()
            title = await page.title()
            
            # Get full page screenshot
            screenshot_bytes = await page.screenshot(full_page=True)
            
            await browser.close()
            
            # Smart Chunking
            chunks = self._smart_chunk(screenshot_bytes)
            
            return {
                "title": title,
                "html_content": content,
                "image_chunks": chunks
            }

    def _smart_chunk(self, screenshot_bytes: bytes) -> List[bytes]:
        image = Image.open(io.BytesIO(screenshot_bytes))
        width, height = image.size
        
        chunks = []
        if height <= self.chunk_size:
            chunks.append(screenshot_bytes)
        else:
            # Slicing with overlap
            start = 0
            while start < height:
                end = min(start + self.chunk_size, height)
                
                # If we are nearing the end, just take the rest
                if start + self.chunk_size > height:
                    # Adjust start to maintain context if needed, or just slice
                    # Here we just take from start to height.
                    # Ideally, we might want to backtrack to ensure consistency, 
                    # but the overlap strategy is usually:
                    # 0-2000, 1800-3800, 3600-5600...
                    pass

                box = (0, start, width, end)
                chunk = image.crop(box)
                
                # Convert back to bytes
                img_byte_arr = io.BytesIO()
                chunk.save(img_byte_arr, format='PNG')
                chunks.append(img_byte_arr.getvalue())
                
                if end == height:
                    break
                    
                start += (self.chunk_size - self.overlap)
                
        return chunks

crawler = Crawler()
