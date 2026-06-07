"""
Application Configuration
Environment-based settings using pydantic-settings
"""

from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Application Settings"""

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)
    
    # Project Info
    PROJECT_NAME: str = "Risk Management Platform"
    PROJECT_VERSION: str = "1.0.0"
    PROJECT_DESCRIPTION: str = "AI-powered platform for financial risk management education"
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    SERVE_FRONTEND: bool = True
    FRONTEND_DIST_DIR: str = str(
        Path(__file__).resolve().parents[2] / "front_end" / "out"
    )
    
    # Database Configuration
    # Use async drivers by default for compatibility with SQLAlchemy async engine.
    # For SQLite use: sqlite+aiosqlite:///./risk_management.db
    # For PostgreSQL use: postgresql+asyncpg://user:pass@host:port/dbname
    DATABASE_URL: str = "sqlite+aiosqlite:///./risk_management.db"
    DATABASE_ECHO: bool = False
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    
    # Authentication
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    TEACHER_REGISTRATION_CODE: str = ""
    
    # OpenAI / LLM Configuration
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_MAX_TOKENS: int = 2000
    
    # RAG Configuration
    RAG_ENABLED: bool = True
    VECTOR_STORE_TYPE: str = "chroma"  # Options: chroma, pinecone, faiss
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    COURSE_MATERIAL_DIR: str = str(
        Path(__file__).resolve().parents[2] / "docs" / "course_materials"
    )
    RAG_TOP_K: int = 5
    RAG_MIN_SCORE: float = 0.05
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
