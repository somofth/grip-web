import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath("backend"))

try:
    from backend.app.main import app
    from backend.app.core.crawler import crawler
    from backend.app.core.scoring import scoring_engine
    from backend.app.models.analysis import AnalysisResult
    print("Backend imports successful!")
except Exception as e:
    print(f"Backend import failed: {e}")
    sys.exit(1)
