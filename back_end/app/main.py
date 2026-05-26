"""
FastAPI Application Factory
Main entry point for the backend service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.routers import (
    auth,
    courses,
    students,
    teachers,
    agents,
    rag
)
from app.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager"""
    # Startup
    print("🚀 Starting Risk Management Platform Backend...")
    await init_db()
    yield
    # Shutdown
    print("🛑 Shutting down application...")


def create_app() -> FastAPI:
    """Create and configure FastAPI application"""
    
    app = FastAPI(
        title="Risk Management Platform API",
        description="AI-powered platform for financial risk management education",
        version="1.0.0",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
        lifespan=lifespan
    )

    # CORS Configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Health Check Endpoint
    @app.get("/health")
    async def health_check():
        """Health check endpoint"""
        return {
            "status": "healthy",
            "service": "Risk Management Platform API",
            "version": "1.0.0"
        }

    # Include Routers
    app.include_router(
        auth.router,
        prefix="/api/v1/auth",
        tags=["Authentication"]
    )
    
    app.include_router(
        courses.router,
        prefix="/api/v1/courses",
        tags=["Courses"]
    )
    
    app.include_router(
        students.router,
        prefix="/api/v1/students",
        tags=["Students"]
    )
    
    app.include_router(
        teachers.router,
        prefix="/api/v1/teachers",
        tags=["Teachers"]
    )
    
    app.include_router(
        agents.router,
        prefix="/api/v1/agents",
        tags=["AI Agents"]
    )
    
    app.include_router(
        rag.router,
        prefix="/api/v1/rag",
        tags=["RAG"]
    )

    return app


# Application instance
app = create_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
