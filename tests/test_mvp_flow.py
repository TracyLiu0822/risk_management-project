from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


def auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_student_question_is_saved_and_visible_to_teacher():
    suffix = uuid4().hex
    student = {"email": f"student-{suffix}@example.com", "password": "password123"}
    teacher = {"email": f"teacher-{suffix}@example.com", "password": "password123"}

    with TestClient(app) as client:
        student_register = client.post(
            "/api/v1/auth/register",
            json={**student, "role": "student"},
        )
        assert student_register.status_code == 200

        teacher_register = client.post(
            "/api/v1/auth/register",
            json={
                **teacher,
                "role": "teacher",
                "teacher_code": "teacher-test-code",
            },
        )
        assert teacher_register.status_code == 200

        student_login = client.post("/api/v1/auth/login", json=student)
        student_tokens = student_login.json()["data"]
        student_token = student_tokens["access_token"]

        refreshed = client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": student_tokens["refresh_token"]},
        )
        assert refreshed.status_code == 200
        assert refreshed.json()["data"]["access_token"]

        answer = client.post(
            "/api/v1/students/ask-tutor",
            json={"question": "VaR 有哪些局限？"},
            headers=auth_header(student_token),
        )
        assert answer.status_code == 200
        answer_data = answer.json()["data"]
        assert answer_data["chat_id"]
        assert answer_data["sources"]
        assert "课程资料" in answer_data["answer"]

        student_history = client.get(
            "/api/v1/students/chat-history",
            headers=auth_header(student_token),
        )
        assert student_history.status_code == 200
        assert student_history.json()["data"]["total"] == 1

        teacher_login = client.post("/api/v1/auth/login", json=teacher)
        teacher_token = teacher_login.json()["data"]["access_token"]
        teacher_history = client.get(
            "/api/v1/teachers/chat-history",
            headers=auth_header(teacher_token),
        )
        assert teacher_history.status_code == 200
        record = teacher_history.json()["data"]["items"][0]
        assert record["student_email"] == student["email"]
        assert record["question"] == "VaR 有哪些局限？"


def test_student_cannot_access_teacher_history():
    suffix = uuid4().hex
    student = {"email": f"student-{suffix}@example.com", "password": "password123"}

    with TestClient(app) as client:
        client.post(
            "/api/v1/auth/register",
            json={**student, "role": "student"},
        )
        login = client.post("/api/v1/auth/login", json=student)
        token = login.json()["data"]["access_token"]

        response = client.get(
            "/api/v1/teachers/chat-history",
            headers=auth_header(token),
        )

        assert response.status_code == 403


def test_teacher_registration_requires_private_code():
    suffix = uuid4().hex
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/auth/register",
            json={
                "email": f"teacher-{suffix}@example.com",
                "password": "password123",
                "role": "teacher",
                "teacher_code": "wrong-code",
            },
        )

        assert response.status_code == 403
