from pathlib import Path

from fastapi.testclient import TestClient

from app.main import create_app


def create_exported_site(root: Path) -> None:
    (root / "login").mkdir(parents=True)
    (root / "_next" / "static").mkdir(parents=True)
    (root / "index.html").write_text(
        "<html><body><h1>Risk Management Platform</h1></body></html>",
        encoding="utf-8",
    )
    (root / "login" / "index.html").write_text(
        "<html><body><h1>Login</h1></body></html>",
        encoding="utf-8",
    )
    (root / "_next" / "static" / "app.js").write_text(
        "console.log('platform');",
        encoding="utf-8",
    )


def test_backend_serves_exported_homepage_and_frontend_routes(tmp_path: Path):
    create_exported_site(tmp_path)

    with TestClient(create_app(frontend_dir=tmp_path)) as client:
        homepage = client.get("/")
        login = client.get("/login/")
        asset = client.get("/_next/static/app.js")

    assert homepage.status_code == 200
    assert "Risk Management Platform" in homepage.text
    assert login.status_code == 200
    assert "<h1>Login</h1>" in login.text
    assert asset.status_code == 200


def test_api_routes_keep_priority_over_static_site(tmp_path: Path):
    create_exported_site(tmp_path)

    with TestClient(create_app(frontend_dir=tmp_path)) as client:
        health = client.get("/health")
        openapi = client.get("/api/openapi.json")

    assert health.status_code == 200
    assert health.json()["status"] == "healthy"
    assert openapi.status_code == 200
    assert "/api/v1/auth/login" in openapi.json()["paths"]


def test_root_explains_how_to_build_frontend_when_export_is_missing(tmp_path: Path):
    with TestClient(create_app(frontend_dir=tmp_path / "missing")) as client:
        response = client.get("/")

    assert response.status_code == 503
    assert "npm run build" in response.json()["build_command"]
