import os
import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client(tmp_path, monkeypatch):
    """TestClient with a fresh isolated SQLite DB per test."""
    monkeypatch.setenv("DB_PATH", str(tmp_path / "test.db"))

    # Import after env var is set so _db_path() resolves correctly
    from app.database import init_db
    from app.main import app

    init_db()
    with TestClient(app) as c:
        yield c
