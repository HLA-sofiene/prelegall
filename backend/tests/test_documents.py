"""
Integration tests for document persistence endpoints.
A fresh SQLite DB is created per test via the `client` fixture in conftest.py.
"""

USER = {"email": "doc@example.com", "password": "password123"}
OTHER_USER = {"email": "other@example.com", "password": "password456"}

SAMPLE_DOC = {
    "name": "My NDA — Apr 2026",
    "doc_type": "mutual_nda",
    "fields": {"party_a_name": "Acme Corp", "party_b_name": "Globex Inc"},
}


def _signup_and_get_client(client, user=USER):
    client.post("/api/auth/signup", json=user)
    return client


class TestSaveDocument:
    def test_save_success(self, client):
        _signup_and_get_client(client)
        resp = client.post("/api/documents", json=SAMPLE_DOC)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == SAMPLE_DOC["name"]
        assert data["doc_type"] == SAMPLE_DOC["doc_type"]
        assert data["fields"] == SAMPLE_DOC["fields"]
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

    def test_save_requires_auth(self, client):
        resp = client.post("/api/documents", json=SAMPLE_DOC)
        assert resp.status_code == 401

    def test_save_invalid_payload(self, client):
        _signup_and_get_client(client)
        # missing required fields
        resp = client.post("/api/documents", json={"name": "x"})
        assert resp.status_code == 422


class TestListDocuments:
    def test_list_empty(self, client):
        _signup_and_get_client(client)
        resp = client.get("/api/documents")
        assert resp.status_code == 200
        assert resp.json() == []

    def test_list_returns_own_documents(self, client):
        _signup_and_get_client(client)
        client.post("/api/documents", json=SAMPLE_DOC)
        client.post("/api/documents", json={**SAMPLE_DOC, "name": "Second Doc"})
        resp = client.get("/api/documents")
        assert resp.status_code == 200
        docs = resp.json()
        assert len(docs) == 2
        # Most recently inserted (highest id) first
        names = [d["name"] for d in docs]
        assert "Second Doc" in names
        assert SAMPLE_DOC["name"] in names
        assert docs[0]["id"] > docs[1]["id"]

    def test_list_requires_auth(self, client):
        resp = client.get("/api/documents")
        assert resp.status_code == 401

    def test_list_isolates_users(self, client):
        """User A should not see User B's documents."""
        # User A saves a document
        _signup_and_get_client(client, USER)
        client.post("/api/documents", json=SAMPLE_DOC)

        # Sign out and sign in as User B
        client.post("/api/auth/signout")
        client.post("/api/auth/signup", json=OTHER_USER)
        resp = client.get("/api/documents")
        assert resp.json() == []


class TestGetDocument:
    def test_get_own_document(self, client):
        _signup_and_get_client(client)
        save_resp = client.post("/api/documents", json=SAMPLE_DOC)
        doc_id = save_resp.json()["id"]
        resp = client.get(f"/api/documents/{doc_id}")
        assert resp.status_code == 200
        assert resp.json()["id"] == doc_id

    def test_get_requires_auth(self, client):
        resp = client.get("/api/documents/1")
        assert resp.status_code == 401

    def test_get_other_users_document_returns_404(self, client):
        """Cannot retrieve another user's document."""
        _signup_and_get_client(client, USER)
        save_resp = client.post("/api/documents", json=SAMPLE_DOC)
        doc_id = save_resp.json()["id"]

        client.post("/api/auth/signout")
        client.post("/api/auth/signup", json=OTHER_USER)
        resp = client.get(f"/api/documents/{doc_id}")
        assert resp.status_code == 404

    def test_get_nonexistent_returns_404(self, client):
        _signup_and_get_client(client)
        resp = client.get("/api/documents/999999")
        assert resp.status_code == 404


class TestDeleteDocument:
    def test_delete_own_document(self, client):
        _signup_and_get_client(client)
        save_resp = client.post("/api/documents", json=SAMPLE_DOC)
        doc_id = save_resp.json()["id"]
        resp = client.delete(f"/api/documents/{doc_id}")
        assert resp.status_code == 204
        # Confirm it is gone
        assert client.get(f"/api/documents/{doc_id}").status_code == 404

    def test_delete_requires_auth(self, client):
        resp = client.delete("/api/documents/1")
        assert resp.status_code == 401

    def test_delete_other_users_document_returns_404(self, client):
        _signup_and_get_client(client, USER)
        save_resp = client.post("/api/documents", json=SAMPLE_DOC)
        doc_id = save_resp.json()["id"]

        client.post("/api/auth/signout")
        client.post("/api/auth/signup", json=OTHER_USER)
        resp = client.delete(f"/api/documents/{doc_id}")
        assert resp.status_code == 404
        # Original document still exists for user A
        client.post("/api/auth/signout")
        client.post("/api/auth/signin", json=USER)
        assert client.get(f"/api/documents/{doc_id}").status_code == 200

    def test_delete_nonexistent_returns_404(self, client):
        _signup_and_get_client(client)
        resp = client.delete("/api/documents/999999")
        assert resp.status_code == 404
