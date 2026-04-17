import json

from fastapi import APIRouter, Cookie, HTTPException, status

from app.database import get_connection
from app.models import DocumentResponse, DocumentSaveRequest
from app.routers.auth import _get_current_user_id

router = APIRouter(prefix="/documents", tags=["documents"])


def _row_to_response(row) -> DocumentResponse:
    return DocumentResponse(
        id=row["id"],
        name=row["name"],
        doc_type=row["doc_type"],
        fields=json.loads(row["fields"]),
        created_at=row["created_at"],
        updated_at=row["updated_at"],
    )


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def save_document(body: DocumentSaveRequest, access_token: str | None = Cookie(default=None)):
    user_id = _get_current_user_id(access_token)
    fields_json = json.dumps(body.fields)
    conn = get_connection()
    try:
        cursor = conn.execute(
            """
            INSERT INTO documents (user_id, name, doc_type, fields)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, body.name, body.doc_type, fields_json),
        )
        conn.commit()
        doc_id = cursor.lastrowid
        row = conn.execute(
            "SELECT id, name, doc_type, fields, created_at, updated_at FROM documents WHERE id = ?",
            (doc_id,),
        ).fetchone()
    finally:
        conn.close()
    return _row_to_response(row)


@router.get("", response_model=list[DocumentResponse])
def list_documents(access_token: str | None = Cookie(default=None)):
    user_id = _get_current_user_id(access_token)
    conn = get_connection()
    try:
        rows = conn.execute(
            """
            SELECT id, name, doc_type, fields, created_at, updated_at
            FROM documents
            WHERE user_id = ?
            ORDER BY updated_at DESC, id DESC
            """,
            (user_id,),
        ).fetchall()
    finally:
        conn.close()
    return [_row_to_response(r) for r in rows]


@router.get("/{doc_id}", response_model=DocumentResponse)
def get_document(doc_id: int, access_token: str | None = Cookie(default=None)):
    user_id = _get_current_user_id(access_token)
    conn = get_connection()
    try:
        row = conn.execute(
            """
            SELECT id, name, doc_type, fields, created_at, updated_at
            FROM documents
            WHERE id = ? AND user_id = ?
            """,
            (doc_id, user_id),
        ).fetchone()
    finally:
        conn.close()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return _row_to_response(row)


@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(doc_id: int, access_token: str | None = Cookie(default=None)):
    user_id = _get_current_user_id(access_token)
    conn = get_connection()
    try:
        result = conn.execute(
            "DELETE FROM documents WHERE id = ? AND user_id = ?",
            (doc_id, user_id),
        )
        conn.commit()
    finally:
        conn.close()
    if result.rowcount == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
