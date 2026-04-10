"""
Integration tests for auth endpoints.
A fresh SQLite DB is created per test via the `client` fixture in conftest.py.
"""


class TestSignup:
    def test_signup_success(self, client):
        resp = client.post("/api/auth/signup", json={"email": "a@example.com", "password": "secret"})
        assert resp.status_code == 201
        data = resp.json()
        assert data["email"] == "a@example.com"
        assert "id" in data
        assert "access_token" in resp.cookies

    def test_signup_duplicate_email(self, client):
        client.post("/api/auth/signup", json={"email": "a@example.com", "password": "secret"})
        resp = client.post("/api/auth/signup", json={"email": "a@example.com", "password": "other"})
        assert resp.status_code == 409

    def test_signup_invalid_email(self, client):
        resp = client.post("/api/auth/signup", json={"email": "not-an-email", "password": "secret"})
        assert resp.status_code == 422


class TestSignin:
    def test_signin_success(self, client):
        client.post("/api/auth/signup", json={"email": "b@example.com", "password": "pass123"})
        resp = client.post("/api/auth/signin", json={"email": "b@example.com", "password": "pass123"})
        assert resp.status_code == 200
        assert resp.json()["email"] == "b@example.com"
        assert "access_token" in resp.cookies

    def test_signin_wrong_password(self, client):
        client.post("/api/auth/signup", json={"email": "c@example.com", "password": "pass123"})
        resp = client.post("/api/auth/signin", json={"email": "c@example.com", "password": "wrong"})
        assert resp.status_code == 401

    def test_signin_unknown_email(self, client):
        resp = client.post("/api/auth/signin", json={"email": "nobody@example.com", "password": "x"})
        assert resp.status_code == 401


class TestMe:
    def test_me_authenticated(self, client):
        client.post("/api/auth/signup", json={"email": "d@example.com", "password": "pw"})
        resp = client.get("/api/auth/me")
        assert resp.status_code == 200
        assert resp.json()["email"] == "d@example.com"

    def test_me_unauthenticated(self, client):
        resp = client.get("/api/auth/me")
        assert resp.status_code == 401


class TestSignout:
    def test_signout_clears_cookie(self, client):
        client.post("/api/auth/signup", json={"email": "e@example.com", "password": "pw"})
        resp = client.post("/api/auth/signout")
        assert resp.status_code == 200
        me_resp = client.get("/api/auth/me")
        assert me_resp.status_code == 401


class TestHealth:
    def test_health(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        assert resp.json() == {"status": "ok"}
