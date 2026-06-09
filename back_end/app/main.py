"""FastAPI application factory and single-site web entry point."""

from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import init_db
from app.routers import agents, auth, courses, rag, students, teachers


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting Risk Management Platform Backend...")
    await init_db()
    yield
    print("Shutting down application...")


def create_app(frontend_dir: str | Path | None = None) -> FastAPI:
    """Create the API and optionally serve the exported Next.js website."""

    app = FastAPI(
        title="Risk Management Platform API",
        description="AI-powered platform for financial risk management education",
        version="1.0.0",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "service": "Risk Management Platform API",
            "version": "1.0.0",
        }

    app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
    app.include_router(courses.router, prefix="/api/v1/courses", tags=["Courses"])
    app.include_router(students.router, prefix="/api/v1/students", tags=["Students"])
    app.include_router(teachers.router, prefix="/api/v1/teachers", tags=["Teachers"])
    app.include_router(agents.router, prefix="/api/v1/agents", tags=["AI Agents"])
    app.include_router(rag.router, prefix="/api/v1/rag", tags=["RAG"])

    if settings.SERVE_FRONTEND:
        static_dir = Path(frontend_dir or settings.FRONTEND_DIST_DIR)
        if (static_dir / "index.html").is_file():
            # Keep this last so API and documentation routes have priority.
            app.mount(
                "/",
                StaticFiles(directory=static_dir, html=True),
                name="frontend",
            )
        else:
            @app.get("/", include_in_schema=False)
            async def frontend_not_built():
                return JSONResponse(
                    status_code=503,
                    content={
                        "message": "Frontend build not found.",
                        "expected_directory": str(static_dir),
                        "build_command": "cd front_end && npm install && npm run build",
                    },
                )

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
