from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    GOOGLE_APPLICATION_CREDENTIALS: str
    FIREBASE_CREDENTIALS: str

    class Config:
        env_file = ".env"

settings = Settings()
