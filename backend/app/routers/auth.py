import os
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import APIRouter, Cookie, HTTPException, Response, status
from jose import JWTError, jwt

from app.database import get_connection
from app.models import SignInRequest, SignUpRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-in-production")
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24
COOKIE_NAME = "access_token"


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def _create_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode({"sub": str(user_id), "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)


def _get_current_user_id(access_token: str | None) -> int:
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user_id


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignUpRequest, response: Response):
    conn = get_connection()
    try:
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (body.email,)).fetchone()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        hashed = _hash_password(body.password)
        cursor = conn.execute(
            "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
            (body.email, hashed),
        )
        conn.commit()
        user_id = cursor.lastrowid
    finally:
        conn.close()

    token = _create_token(user_id)
    response.set_cookie(COOKIE_NAME, token, httponly=True, samesite="lax", max_age=TOKEN_EXPIRE_HOURS * 3600)
    return UserResponse(id=user_id, email=body.email)


@router.post("/signin", response_model=UserResponse)
def signin(body: SignInRequest, response: Response):
    conn = get_connection()
    try:
        row = conn.execute("SELECT id, hashed_password FROM users WHERE email = ?", (body.email,)).fetchone()
    finally:
        conn.close()

    if not row or not _verify_password(body.password, row["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = _create_token(row["id"])
    response.set_cookie(COOKIE_NAME, token, httponly=True, samesite="lax", max_age=TOKEN_EXPIRE_HOURS * 3600)
    return UserResponse(id=row["id"], email=body.email)


@router.post("/signout")
def signout(response: Response):
    response.delete_cookie(COOKIE_NAME)
    return {"message": "Signed out"}


@router.get("/me", response_model=UserResponse)
def me(access_token: str | None = Cookie(default=None)):
    user_id = _get_current_user_id(access_token)
    conn = get_connection()
    try:
        row = conn.execute("SELECT id, email FROM users WHERE id = ?", (user_id,)).fetchone()
    finally:
        conn.close()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return UserResponse(id=row["id"], email=row["email"])
