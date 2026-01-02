import firebase_admin
from firebase_admin import credentials, firestore
from .config import settings
import os

# Initialize Firebase Admin
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Warning: Could not initialize Firebase: {e}")
        # Identify if we should fail or run in mock mode
        # For now, we print warning, but in production this should be critical.

def get_db():
    try:
        return firestore.client()
    except Exception:
        return None
