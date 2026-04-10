import json
import logging
import os
from typing import Optional

import litellm
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models import ChatRequest, ChatResponse

load_dotenv()

# Disable SSL verification at import time for corporate TLS-intercepting proxies
if os.environ.get("OPENROUTER_TLS_VERIFY", "").lower() == "false":
    litellm.ssl_verify = False

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

NDA_FIELDS = [
    "party_a_name",
    "party_a_address",
    "party_b_name",
    "party_b_address",
    "effective_date",
    "purpose",
    "duration_years",
    "governing_law",
]

SYSTEM_PROMPT = """You are a helpful legal document assistant specializing in Mutual Non-Disclosure Agreements (NDAs).

Your job is to help the user draft a Mutual NDA by gathering the following required information through natural, conversational dialogue:
- party_a_name: Full legal name of Party A (first party/company)
- party_a_address: Full address of Party A
- party_b_name: Full legal name of Party B (second party/company)
- party_b_address: Full address of Party B
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- purpose: The specific purpose for which confidential information will be disclosed
- duration_years: How many years the confidentiality obligation lasts (default is 3)
- governing_law: The governing law jurisdiction (e.g. "California, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
"""


class _NdaFieldsOutput(BaseModel):
    message: str
    party_a_name: Optional[str] = None
    party_a_address: Optional[str] = None
    party_b_name: Optional[str] = None
    party_b_address: Optional[str] = None
    effective_date: Optional[str] = None
    purpose: Optional[str] = None
    duration_years: Optional[str] = None
    governing_law: Optional[str] = None


@router.post("", response_model=ChatResponse)
def chat(body: ChatRequest):
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    filled = {k: v for k, v in body.current_fields.items() if v and v.strip()}
    missing = [k for k in NDA_FIELDS if k not in filled]

    fields_context = (
        f"\nCurrently extracted fields: {json.dumps(filled) if filled else 'none yet'}"
        f"\nStill needed: {', '.join(missing) if missing else 'all fields complete — congratulate the user'}"
    )

    messages = [{"role": "system", "content": SYSTEM_PROMPT + fields_context}]
    for msg in body.messages:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        response = litellm.completion(
            model=MODEL,
            api_key=api_key,
            messages=messages,
            response_format=_NdaFieldsOutput,
            reasoning_effort="low",
            extra_body=EXTRA_BODY,
        )
        result = _NdaFieldsOutput.model_validate_json(response.choices[0].message.content)
    except Exception as exc:
        logger.exception("LiteLLM call failed")
        raise HTTPException(status_code=500, detail="AI service temporarily unavailable") from exc

    extracted = {
        field: str(getattr(result, field))
        for field in NDA_FIELDS
        if getattr(result, field) is not None
    }

    return ChatResponse(message=result.message, fields=extracted)
