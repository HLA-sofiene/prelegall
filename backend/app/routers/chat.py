import json
import logging
import os
from dataclasses import dataclass
from typing import Optional

import litellm
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, create_model

from app.models import ChatRequest, ChatResponse

load_dotenv()

# Disable SSL verification at import time for corporate TLS-intercepting proxies
if os.environ.get("OPENROUTER_TLS_VERIFY", "").lower() == "false":
    litellm.ssl_verify = False

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

_FOLLOW_UP_RULE = (
    "IMPORTANT: If there are still missing fields, you MUST end every response with a "
    "question to gather the next piece of missing information. Never give a statement "
    "without asking a follow-up question when fields are still needed."
)


def _make_output_model(fields: list[str], key: str) -> type[BaseModel]:
    """Dynamically create a named Pydantic model: message: str + one Optional[str] per field.
    The key is embedded in the model name to avoid JSON schema title collisions when
    multiple models are sent to the same OpenRouter/OpenAI structured-output endpoint."""
    return create_model(
        f"FieldsOutput_{key}",
        message=(str, ...),
        **{f: (Optional[str], None) for f in fields},
    )


@dataclass
class DocTypeConfig:
    fields: list[str]
    output_model: type[BaseModel]
    system_prompt: str


def _cfg(key: str, fields: list[str], prompt: str) -> DocTypeConfig:
    return DocTypeConfig(fields=fields, output_model=_make_output_model(fields, key), system_prompt=prompt)


# ---------------------------------------------------------------------------
# Per-document-type configuration
# ---------------------------------------------------------------------------

_NDA_FIELDS = [
    "party_a_name", "party_a_address",
    "party_b_name", "party_b_address",
    "effective_date", "purpose", "duration_years", "governing_law",
]

_NDA_PROMPT = f"""You are a helpful legal document assistant specializing in Mutual Non-Disclosure Agreements (NDAs).

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
- {_FOLLOW_UP_RULE}
"""

_CSA_FIELDS = [
    "provider_name", "provider_address",
    "customer_name", "customer_address",
    "effective_date", "service_description",
    "subscription_term_months", "fees", "payment_terms", "governing_law",
]

_CSA_PROMPT = f"""You are a helpful legal document assistant specializing in Cloud Service Agreements.

Your job is to help the user draft a Cloud Service Agreement by gathering the following required information through natural, conversational dialogue:
- provider_name: Full legal name of the service provider
- provider_address: Full address of the service provider
- customer_name: Full legal name of the customer
- customer_address: Full address of the customer
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- service_description: Description of the cloud services being provided
- subscription_term_months: Subscription term length in months (e.g. 12)
- fees: Subscription fees (e.g. "$5,000/month" or "$50,000/year")
- payment_terms: Payment terms (e.g. "Net 30", "monthly in advance")
- governing_law: The governing law jurisdiction (e.g. "Delaware, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_PILOT_FIELDS = [
    "provider_name", "provider_address",
    "customer_name", "customer_address",
    "effective_date", "pilot_duration_days",
    "service_description", "success_criteria", "pilot_fees", "governing_law",
]

_PILOT_PROMPT = f"""You are a helpful legal document assistant specializing in Pilot Agreements.

Your job is to help the user draft a Pilot Agreement by gathering the following required information through natural, conversational dialogue:
- provider_name: Full legal name of the service provider
- provider_address: Full address of the service provider
- customer_name: Full legal name of the customer
- customer_address: Full address of the customer
- effective_date: Pilot start date (YYYY-MM-DD format)
- pilot_duration_days: Duration of the pilot in days (e.g. 30, 60, 90)
- service_description: Description of the service being evaluated during the pilot
- success_criteria: How the success of the pilot will be measured
- pilot_fees: Fees for the pilot period (e.g. "$0", "no charge", "$5,000")
- governing_law: The governing law jurisdiction (e.g. "California, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_DESIGN_PARTNER_FIELDS = [
    "provider_name", "provider_address",
    "partner_name", "partner_address",
    "effective_date", "product_description",
    "feedback_obligations", "governing_law",
]

_DESIGN_PARTNER_PROMPT = f"""You are a helpful legal document assistant specializing in Design Partner Agreements.

Your job is to help the user draft a Design Partner Agreement by gathering the following required information through natural, conversational dialogue:
- provider_name: Full legal name of the product/service provider
- provider_address: Full address of the provider
- partner_name: Full legal name of the design partner
- partner_address: Full address of the design partner
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- product_description: Description of the pre-release product or service being evaluated
- feedback_obligations: Description of the partner's obligations to provide feedback (e.g. "monthly written reports and bi-weekly calls")
- governing_law: The governing law jurisdiction (e.g. "California, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_SLA_FIELDS = [
    "provider_name", "customer_name",
    "effective_date", "service_description",
    "uptime_commitment", "response_time_critical",
    "service_credits", "governing_law",
]

_SLA_PROMPT = f"""You are a helpful legal document assistant specializing in Service Level Agreements (SLAs).

Your job is to help the user draft an SLA by gathering the following required information through natural, conversational dialogue:
- provider_name: Full legal name of the service provider
- customer_name: Full legal name of the customer
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- service_description: Description of the services covered by this SLA
- uptime_commitment: Uptime percentage commitment (e.g. "99.9%")
- response_time_critical: Response time target for critical incidents (e.g. "1 hour")
- service_credits: Service credit percentage owed for SLA breaches (e.g. "10%")
- governing_law: The governing law jurisdiction (e.g. "California, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_PSA_FIELDS = [
    "provider_name", "provider_address",
    "client_name", "client_address",
    "effective_date", "services_description",
    "deliverables", "fees", "payment_terms", "governing_law",
]

_PSA_PROMPT = f"""You are a helpful legal document assistant specializing in Professional Services Agreements.

Your job is to help the user draft a Professional Services Agreement by gathering the following required information through natural, conversational dialogue:
- provider_name: Full legal name of the service provider
- provider_address: Full address of the service provider
- client_name: Full legal name of the client
- client_address: Full address of the client
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- services_description: Description of the professional services to be provided
- deliverables: Key deliverables to be produced (e.g. "design mockups, final report, training materials")
- fees: Professional fees (e.g. "$15,000 fixed fee" or "$200/hour")
- payment_terms: Payment terms (e.g. "50% upfront, 50% on delivery" or "Net 30")
- governing_law: The governing law jurisdiction (e.g. "New York, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_PARTNERSHIP_FIELDS = [
    "party_a_name", "party_a_address",
    "party_b_name", "party_b_address",
    "effective_date", "partnership_purpose",
    "revenue_split", "term_years", "governing_law",
]

_PARTNERSHIP_PROMPT = f"""You are a helpful legal document assistant specializing in Partnership Agreements.

Your job is to help the user draft a Partnership Agreement by gathering the following required information through natural, conversational dialogue:
- party_a_name: Full legal name of the first party
- party_a_address: Full address of the first party
- party_b_name: Full legal name of the second party
- party_b_address: Full address of the second party
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- partnership_purpose: The purpose and nature of the partnership
- revenue_split: Revenue and profit sharing arrangement (e.g. "50/50", "60/40 in favor of Party A")
- term_years: Term of the partnership in years
- governing_law: The governing law jurisdiction (e.g. "Delaware, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_SLA_FIELDS_SW = [
    "licensor_name", "licensor_address",
    "licensee_name", "licensee_address",
    "effective_date", "software_name",
    "license_type", "license_fee", "term", "governing_law",
]

_SW_LICENSE_PROMPT = f"""You are a helpful legal document assistant specializing in Software License Agreements.

Your job is to help the user draft a Software License Agreement by gathering the following required information through natural, conversational dialogue:
- licensor_name: Full legal name of the software licensor
- licensor_address: Full address of the licensor
- licensee_name: Full legal name of the licensee
- licensee_address: Full address of the licensee
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- software_name: Name of the software being licensed
- license_type: Type of license (e.g. "perpetual", "annual subscription", "site license")
- license_fee: License fee (e.g. "$10,000 one-time" or "$2,000/year")
- term: License term (e.g. "perpetual" or "2 years")
- governing_law: The governing law jurisdiction (e.g. "California, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_DPA_FIELDS = [
    "controller_name", "controller_address",
    "processor_name", "processor_address",
    "effective_date", "data_types",
    "processing_purposes", "retention_period", "governing_law",
]

_DPA_PROMPT = f"""You are a helpful legal document assistant specializing in Data Processing Agreements (DPAs).

Your job is to help the user draft a GDPR-compliant Data Processing Agreement by gathering the following required information through natural, conversational dialogue:
- controller_name: Full legal name of the data controller
- controller_address: Full address of the data controller
- processor_name: Full legal name of the data processor
- processor_address: Full address of the data processor
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- data_types: Types of personal data being processed (e.g. "names, email addresses, payment information")
- processing_purposes: Purposes for which the data is being processed
- retention_period: How long personal data will be retained (e.g. "7 years", "until contract termination")
- governing_law: The governing law jurisdiction (e.g. "England and Wales")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_BAA_FIELDS = [
    "covered_entity_name", "covered_entity_address",
    "business_associate_name", "business_associate_address",
    "effective_date", "services_description",
    "phi_types", "governing_law",
]

_BAA_PROMPT = f"""You are a helpful legal document assistant specializing in Business Associate Agreements (BAAs).

Your job is to help the user draft a HIPAA-compliant Business Associate Agreement by gathering the following required information through natural, conversational dialogue:
- covered_entity_name: Full legal name of the HIPAA covered entity
- covered_entity_address: Full address of the covered entity
- business_associate_name: Full legal name of the business associate
- business_associate_address: Full address of the business associate
- effective_date: Effective date of the agreement (YYYY-MM-DD format)
- services_description: Description of services the business associate provides that involve PHI
- phi_types: Types of protected health information (PHI) involved (e.g. "medical records, billing data, diagnoses")
- governing_law: The governing law jurisdiction (e.g. "California, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

_AI_ADDENDUM_FIELDS = [
    "party_a_name", "party_b_name",
    "effective_date", "base_agreement_name",
    "ai_features_description", "input_ownership",
    "output_ownership", "governing_law",
]

_AI_ADDENDUM_PROMPT = f"""You are a helpful legal document assistant specializing in AI Addendums.

Your job is to help the user draft an AI Addendum to an existing agreement by gathering the following required information through natural, conversational dialogue:
- party_a_name: Full legal name of the first party (typically the AI service provider)
- party_b_name: Full legal name of the second party (typically the customer)
- effective_date: Effective date of this addendum (YYYY-MM-DD format)
- base_agreement_name: Name of the underlying agreement this addendum supplements (e.g. "Cloud Service Agreement dated January 1, 2025")
- ai_features_description: Description of the AI/ML features or services covered by this addendum
- input_ownership: Who owns the inputs provided to the AI system (e.g. "Customer retains all ownership of inputs")
- output_ownership: Who owns the outputs generated by the AI system (e.g. "Customer owns all outputs", "Provider retains rights to improve the model")
- governing_law: The governing law jurisdiction (e.g. "Delaware, USA")

Guidelines:
- On the very first message (no conversation history), greet the user and briefly explain what you'll help with
- Ask natural follow-up questions to gather missing information, one or two topics at a time
- Confirm information back to the user when you extract it
- When all required fields are gathered, congratulate the user and tell them they can download the PDF
- Keep responses concise and friendly
- {_FOLLOW_UP_RULE}
"""

# ---------------------------------------------------------------------------
# Registry
# ---------------------------------------------------------------------------

DOC_REGISTRY: dict[str, DocTypeConfig] = {
    "mutual_nda": _cfg("mutual_nda", _NDA_FIELDS, _NDA_PROMPT),
    "cloud_service_agreement": _cfg("cloud_service_agreement", _CSA_FIELDS, _CSA_PROMPT),
    "pilot_agreement": _cfg("pilot_agreement", _PILOT_FIELDS, _PILOT_PROMPT),
    "design_partner_agreement": _cfg("design_partner_agreement", _DESIGN_PARTNER_FIELDS, _DESIGN_PARTNER_PROMPT),
    "service_level_agreement": _cfg("service_level_agreement", _SLA_FIELDS, _SLA_PROMPT),
    "professional_services_agreement": _cfg("professional_services_agreement", _PSA_FIELDS, _PSA_PROMPT),
    "partnership_agreement": _cfg("partnership_agreement", _PARTNERSHIP_FIELDS, _PARTNERSHIP_PROMPT),
    "software_license_agreement": _cfg("software_license_agreement", _SLA_FIELDS_SW, _SW_LICENSE_PROMPT),
    "data_processing_agreement": _cfg("data_processing_agreement", _DPA_FIELDS, _DPA_PROMPT),
    "business_associate_agreement": _cfg("business_associate_agreement", _BAA_FIELDS, _BAA_PROMPT),
    "ai_addendum": _cfg("ai_addendum", _AI_ADDENDUM_FIELDS, _AI_ADDENDUM_PROMPT),
}

# ---------------------------------------------------------------------------
# Detection phase (no doc_type yet)
# ---------------------------------------------------------------------------

_DETECTION_SYSTEM_PROMPT = """You are a helpful legal document assistant. Your job is to identify what type of legal document the user needs and greet them warmly.

Available document types (use exactly these identifiers):
- mutual_nda: Mutual Non-Disclosure Agreement — protects confidential information shared between two parties
- cloud_service_agreement: Cloud Service Agreement — for selling/buying cloud software or SaaS products
- pilot_agreement: Pilot Agreement — short-term trial or evaluation of a product before committing
- design_partner_agreement: Design Partner Agreement — early product access in exchange for feedback
- service_level_agreement: Service Level Agreement — defines uptime targets, response times, service credits
- professional_services_agreement: Professional Services Agreement — for consulting, deliverables, project work
- partnership_agreement: Partnership Agreement — business partnerships with cooperation and revenue sharing
- software_license_agreement: Software License Agreement — for on-premise or installable software
- data_processing_agreement: Data Processing Agreement — GDPR-compliant data processing obligations
- business_associate_agreement: Business Associate Agreement — HIPAA-compliant agreement for handling PHI
- ai_addendum: AI Addendum — addendum for agreements involving AI/ML features

Guidelines:
- On the very first message (empty history), greet the user warmly and ask what type of legal document they need. Briefly mention a few examples.
- When the user describes their need, identify the best matching document type and set detected_doc_type to its identifier
- If you are confident in the document type, confirm it in your message (e.g. "Great, I'll help you draft a Cloud Service Agreement!")
- If unsure between multiple types, ask a clarifying question and leave detected_doc_type as null
- Keep responses concise and friendly
"""


class _DetectionOutput(BaseModel):
    message: str
    detected_doc_type: Optional[str] = None


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post("", response_model=ChatResponse)
def chat(body: ChatRequest):
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    # --- Detection phase: no doc_type known yet ---
    if body.doc_type is None:
        messages = [{"role": "system", "content": _DETECTION_SYSTEM_PROMPT}]
        for msg in body.messages:
            messages.append({"role": msg.role, "content": msg.content})

        try:
            response = litellm.completion(
                model=MODEL,
                api_key=api_key,
                messages=messages,
                response_format=_DetectionOutput,
                reasoning_effort="low",
                extra_body=EXTRA_BODY,
            )
            result = _DetectionOutput.model_validate_json(response.choices[0].message.content)
        except Exception as exc:
            logger.exception("LiteLLM detection call failed")
            raise HTTPException(status_code=500, detail="AI service temporarily unavailable") from exc

        return ChatResponse(
            message=result.message,
            fields={},
            doc_type=result.detected_doc_type,
        )

    # --- Field-gathering phase: doc_type is known ---
    config = DOC_REGISTRY.get(body.doc_type)
    if config is None:
        raise HTTPException(status_code=400, detail=f"Unknown document type: {body.doc_type}")

    filled = {k: v for k, v in body.current_fields.items() if v and v.strip()}
    missing = [k for k in config.fields if k not in filled]

    fields_context = (
        f"\nCurrently extracted fields: {json.dumps(filled) if filled else 'none yet'}"
        f"\nStill needed: {', '.join(missing) if missing else 'all fields complete — congratulate the user'}"
    )

    messages = [{"role": "system", "content": config.system_prompt + fields_context}]
    for msg in body.messages:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        response = litellm.completion(
            model=MODEL,
            api_key=api_key,
            messages=messages,
            response_format=config.output_model,
            reasoning_effort="low",
            extra_body=EXTRA_BODY,
        )
        raw = response.choices[0].message.content
        result = config.output_model.model_validate_json(raw)
    except Exception as exc:
        logger.exception("LiteLLM field-gathering call failed")
        raise HTTPException(status_code=500, detail="AI service temporarily unavailable") from exc

    extracted = {
        field: str(getattr(result, field))
        for field in config.fields
        if getattr(result, field, None) is not None
    }

    return ChatResponse(message=result.message, fields=extracted, doc_type=body.doc_type)
