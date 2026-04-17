from typing import Annotated, Literal

from pydantic import BaseModel, EmailStr, Field


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str


class SignInRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class ChatRequest(BaseModel):
    messages: Annotated[list[ChatMessage], Field(max_length=50)] = []
    current_fields: dict[str, str] = {}
    doc_type: str | None = None


class ChatResponse(BaseModel):
    message: str
    fields: dict[str, str]
    doc_type: str | None = None


class DocumentSaveRequest(BaseModel):
    name: str = Field(max_length=200)
    doc_type: str = Field(max_length=100)
    fields: dict[str, str]


class DocumentResponse(BaseModel):
    id: int
    name: str
    doc_type: str
    fields: dict[str, str]
    created_at: str
    updated_at: str
