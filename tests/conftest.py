import os
import sys
from pathlib import Path

import pytest


TEST_DB = Path(__file__).parent / "test_mvp.db"
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "back_end"))
os.environ["SECRET_KEY"] = "test-secret-key"
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{TEST_DB.as_posix()}"
os.environ["OPENAI_API_KEY"] = ""
os.environ["TEACHER_REGISTRATION_CODE"] = "teacher-test-code"


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_database():
    TEST_DB.unlink(missing_ok=True)
    yield
    TEST_DB.unlink(missing_ok=True)
