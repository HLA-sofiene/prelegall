import type { DocTemplate } from './renderTemplate'

function sigSection(nameA: string, nameB: string): { id: string; title: string; content: string } {
  return {
    id: 'signatures',
    title: 'Signatures',
    content: `IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\n{{${nameA}}}\nSignature: _______________________\nName: ___________________________\nTitle: ___________________________\nDate: ____________________________\n\n{{${nameB}}}\nSignature: _______________________\nName: ___________________________\nTitle: ___________________________\nDate: ____________________________`,
  }
}

export const designPartnerAgreementTemplate: DocTemplate = {
  id: 'design_partner_agreement',
  name: 'Design Partner Agreement',
  variables: [
    { key: 'provider_name', label: 'Provider — Full Legal Name', type: 'text', required: true },
    { key: 'provider_address', label: 'Provider — Address', type: 'text', required: true },
    { key: 'partner_name', label: 'Design Partner — Full Legal Name', type: 'text', required: true },
    { key: 'partner_address', label: 'Design Partner — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'product_description', label: 'Product / Service Description', type: 'text', required: true },
    { key: 'feedback_obligations', label: 'Partner Feedback Obligations', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Design Partner Agreement ("Agreement") is entered into as of {{effective_date}} between {{provider_name}}, located at {{provider_address}} ("Provider"), and {{partner_name}}, located at {{partner_address}} ("Design Partner").',
    },
    {
      id: 'product_access',
      title: '2. Product Access',
      content:
        'Provider grants Design Partner early, pre-release access to the following product or service: {{product_description}} (the "Product"). This access is provided for evaluation and feedback purposes only, and Design Partner acknowledges that the Product may contain bugs, incomplete features, or change materially before general availability.',
    },
    {
      id: 'feedback',
      title: '3. Feedback Obligations',
      content:
        'In consideration for access to the Product, Design Partner agrees to: {{feedback_obligations}}. Design Partner grants Provider a perpetual, irrevocable, royalty-free license to use any Feedback to improve, develop, and commercialize the Product without restriction or compensation to Design Partner.',
    },
    {
      id: 'ip',
      title: '4. Intellectual Property',
      content:
        'Provider retains all right, title, and interest in and to the Product and all related intellectual property. Design Partner retains all rights in any data it provides. No license is granted to Design Partner except as expressly set forth herein.',
    },
    {
      id: 'confidentiality',
      title: '5. Confidentiality',
      content:
        'Design Partner agrees to keep the Product, its features, and the terms of this Agreement strictly confidential. Design Partner shall not disclose any information about the Product to third parties without Provider\'s prior written consent.',
    },
    {
      id: 'term',
      title: '6. Term and Termination',
      content:
        'This Agreement commences on {{effective_date}} and continues until either party provides thirty (30) days written notice of termination, or until the Product reaches general availability, whichever comes first.',
    },
    {
      id: 'governing_law',
      title: '7. Governing Law',
      content:
        'This Agreement shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    sigSection('provider_name', 'partner_name'),
  ],
}

export const serviceLevelAgreementTemplate: DocTemplate = {
  id: 'service_level_agreement',
  name: 'Service Level Agreement',
  variables: [
    { key: 'provider_name', label: 'Service Provider — Full Legal Name', type: 'text', required: true },
    { key: 'customer_name', label: 'Customer — Full Legal Name', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'service_description', label: 'Services Covered by This SLA', type: 'text', required: true },
    { key: 'uptime_commitment', label: 'Uptime Commitment (e.g. 99.9%)', type: 'text', required: true },
    { key: 'response_time_critical', label: 'Response Time — Critical Issues', type: 'text', required: true },
    { key: 'service_credits', label: 'Service Credit for SLA Breach', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'overview',
      title: '1. Overview',
      content:
        'This Service Level Agreement ("SLA") is entered into as of {{effective_date}} between {{provider_name}} ("Provider") and {{customer_name}} ("Customer") and governs the service levels for: {{service_description}}.',
    },
    {
      id: 'availability',
      title: '2. Service Availability',
      content:
        'Provider commits to maintaining a monthly uptime percentage of {{uptime_commitment}} for the services described herein, measured over each calendar month, excluding scheduled maintenance windows communicated at least 48 hours in advance.',
    },
    {
      id: 'response',
      title: '3. Incident Response',
      content:
        'Provider shall respond to and begin remediation of service incidents within the following timeframes: Critical (service unavailable or severely degraded): {{response_time_critical}}. Provider shall provide status updates every two hours until critical incidents are resolved.',
    },
    {
      id: 'credits',
      title: '4. Service Credits',
      content:
        'If Provider fails to meet the uptime commitment in any calendar month, Customer shall be entitled to a service credit of {{service_credits}} of that month\'s fees. Service credits are Customer\'s sole remedy for SLA breaches and must be claimed within thirty (30) days of the end of the affected month.',
    },
    {
      id: 'exclusions',
      title: '5. Exclusions',
      content:
        'SLA commitments do not apply to downtime caused by: (a) Customer\'s actions or failures; (b) third-party services outside Provider\'s control; (c) force majeure events; or (d) scheduled maintenance.',
    },
    {
      id: 'governing_law',
      title: '6. Governing Law',
      content:
        'This SLA shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    sigSection('provider_name', 'customer_name'),
  ],
}

export const professionalServicesAgreementTemplate: DocTemplate = {
  id: 'professional_services_agreement',
  name: 'Professional Services Agreement',
  variables: [
    { key: 'provider_name', label: 'Provider — Full Legal Name', type: 'text', required: true },
    { key: 'provider_address', label: 'Provider — Address', type: 'text', required: true },
    { key: 'client_name', label: 'Client — Full Legal Name', type: 'text', required: true },
    { key: 'client_address', label: 'Client — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'services_description', label: 'Description of Professional Services', type: 'text', required: true },
    { key: 'deliverables', label: 'Key Deliverables', type: 'text', required: true },
    { key: 'fees', label: 'Professional Fees', type: 'text', required: true },
    { key: 'payment_terms', label: 'Payment Terms', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Professional Services Agreement ("Agreement") is entered into as of {{effective_date}} between {{provider_name}}, located at {{provider_address}} ("Provider"), and {{client_name}}, located at {{client_address}} ("Client").',
    },
    {
      id: 'services',
      title: '2. Services and Deliverables',
      content:
        'Provider shall perform the following professional services: {{services_description}}. Provider shall deliver the following: {{deliverables}}. Provider shall perform the services in a professional and workmanlike manner consistent with industry standards.',
    },
    {
      id: 'fees',
      title: '3. Fees and Payment',
      content:
        'Client shall pay Provider {{fees}} for the services. Payment shall be made pursuant to the following terms: {{payment_terms}}. Provider may suspend services if payment is more than fifteen (15) days past due.',
    },
    {
      id: 'ip',
      title: '4. Intellectual Property',
      content:
        'Upon receipt of full payment, Provider assigns to Client all right, title, and interest in the deliverables produced specifically for Client under this Agreement. Provider retains ownership of any pre-existing intellectual property, tools, methodologies, and frameworks used in performing the services.',
    },
    {
      id: 'confidentiality',
      title: '5. Confidentiality',
      content:
        'Each party agrees to keep confidential the other party\'s Confidential Information and not to use it except as necessary to perform this Agreement. This obligation survives termination for a period of three (3) years.',
    },
    {
      id: 'liability',
      title: '6. Limitation of Liability',
      content:
        'Provider\'s aggregate liability shall not exceed the total fees paid by Client in the three (3) months preceding the claim. Neither party shall be liable for indirect, incidental, or consequential damages.',
    },
    {
      id: 'governing_law',
      title: '7. Governing Law',
      content:
        'This Agreement shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    sigSection('provider_name', 'client_name'),
  ],
}

export const partnershipAgreementTemplate: DocTemplate = {
  id: 'partnership_agreement',
  name: 'Partnership Agreement',
  variables: [
    { key: 'party_a_name', label: 'Party A — Full Legal Name', type: 'text', required: true },
    { key: 'party_a_address', label: 'Party A — Address', type: 'text', required: true },
    { key: 'party_b_name', label: 'Party B — Full Legal Name', type: 'text', required: true },
    { key: 'party_b_address', label: 'Party B — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'partnership_purpose', label: 'Purpose of Partnership', type: 'text', required: true },
    { key: 'revenue_split', label: 'Revenue / Profit Sharing', type: 'text', required: true },
    { key: 'term_years', label: 'Partnership Term (years)', type: 'number', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Partnership Agreement ("Agreement") is entered into as of {{effective_date}} between {{party_a_name}}, located at {{party_a_address}} ("Party A"), and {{party_b_name}}, located at {{party_b_address}} ("Party B").',
    },
    {
      id: 'purpose',
      title: '2. Purpose',
      content:
        'The parties hereby agree to cooperate for the following purpose: {{partnership_purpose}}. Each party shall perform its obligations in good faith and in accordance with the terms of this Agreement.',
    },
    {
      id: 'revenue',
      title: '3. Revenue and Profit Sharing',
      content:
        'Revenue and profits generated through the partnership shall be shared as follows: {{revenue_split}}. Each party shall maintain accurate records of its activities and provide quarterly financial reports to the other party.',
    },
    {
      id: 'confidentiality',
      title: '4. Confidentiality',
      content:
        'Each party agrees to keep confidential the other party\'s Confidential Information and not to use it for any purpose outside the scope of this partnership. This obligation survives termination of the Agreement for three (3) years.',
    },
    {
      id: 'term',
      title: '5. Term and Termination',
      content:
        'This Agreement shall remain in effect for {{term_years}} years from the effective date, unless earlier terminated by mutual written agreement or upon sixty (60) days written notice by either party.',
    },
    {
      id: 'governing_law',
      title: '6. Governing Law',
      content:
        'This Agreement shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    sigSection('party_a_name', 'party_b_name'),
  ],
}

export const softwareLicenseAgreementTemplate: DocTemplate = {
  id: 'software_license_agreement',
  name: 'Software License Agreement',
  variables: [
    { key: 'licensor_name', label: 'Licensor — Full Legal Name', type: 'text', required: true },
    { key: 'licensor_address', label: 'Licensor — Address', type: 'text', required: true },
    { key: 'licensee_name', label: 'Licensee — Full Legal Name', type: 'text', required: true },
    { key: 'licensee_address', label: 'Licensee — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'software_name', label: 'Software Name', type: 'text', required: true },
    { key: 'license_type', label: 'License Type (e.g. perpetual, annual)', type: 'text', required: true },
    { key: 'license_fee', label: 'License Fee', type: 'text', required: true },
    { key: 'term', label: 'License Term', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Software License Agreement ("Agreement") is entered into as of {{effective_date}} between {{licensor_name}}, located at {{licensor_address}} ("Licensor"), and {{licensee_name}}, located at {{licensee_address}} ("Licensee").',
    },
    {
      id: 'grant',
      title: '2. License Grant',
      content:
        'Subject to the terms of this Agreement and payment of all fees, Licensor grants Licensee a {{license_type}}, non-exclusive, non-transferable license to install and use {{software_name}} ("Software") solely for Licensee\'s internal business purposes. Licensee shall not: (a) sublicense, sell, or distribute the Software; (b) reverse engineer or decompile the Software; (c) create derivative works; or (d) remove any proprietary notices.',
    },
    {
      id: 'fees',
      title: '3. Fees',
      content:
        'Licensee shall pay Licensor a license fee of {{license_fee}} for the {{term}} license term. Payment is due within thirty (30) days of invoice. Fees are non-refundable.',
    },
    {
      id: 'ip',
      title: '4. Intellectual Property',
      content:
        'Licensor retains all right, title, and interest in and to the Software, including all intellectual property rights. This Agreement does not convey any ownership interest in the Software to Licensee.',
    },
    {
      id: 'warranty',
      title: '5. Warranty',
      content:
        'Licensor warrants that the Software will perform substantially in accordance with its documentation for ninety (90) days from delivery. EXCEPT FOR THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.',
    },
    {
      id: 'liability',
      title: '6. Limitation of Liability',
      content:
        'IN NO EVENT SHALL LICENSOR\'S AGGREGATE LIABILITY EXCEED THE LICENSE FEES PAID BY LICENSEE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES.',
    },
    {
      id: 'governing_law',
      title: '7. Governing Law',
      content:
        'This Agreement shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    sigSection('licensor_name', 'licensee_name'),
  ],
}

export const dataProcessingAgreementTemplate: DocTemplate = {
  id: 'data_processing_agreement',
  name: 'Data Processing Agreement',
  variables: [
    { key: 'controller_name', label: 'Data Controller — Full Legal Name', type: 'text', required: true },
    { key: 'controller_address', label: 'Data Controller — Address', type: 'text', required: true },
    { key: 'processor_name', label: 'Data Processor — Full Legal Name', type: 'text', required: true },
    { key: 'processor_address', label: 'Data Processor — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'data_types', label: 'Types of Personal Data', type: 'text', required: true },
    { key: 'processing_purposes', label: 'Purposes of Processing', type: 'text', required: true },
    { key: 'retention_period', label: 'Data Retention Period', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Data Processing Agreement ("DPA") is entered into as of {{effective_date}} between {{controller_name}}, located at {{controller_address}} ("Controller"), and {{processor_name}}, located at {{processor_address}} ("Processor").',
    },
    {
      id: 'subject',
      title: '2. Subject Matter and Nature of Processing',
      content:
        'Processor shall process the following categories of personal data on behalf of Controller: {{data_types}}. The processing shall be carried out for the following purposes: {{processing_purposes}}. Processor shall process personal data only on documented instructions from Controller.',
    },
    {
      id: 'obligations',
      title: '3. Processor Obligations',
      content:
        'Processor shall: (a) process personal data only on Controller\'s documented instructions; (b) ensure that persons authorised to process the personal data are bound by confidentiality; (c) implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk; (d) not engage sub-processors without Controller\'s prior written consent; (e) assist Controller in responding to data subject rights requests; (f) notify Controller without undue delay upon becoming aware of a personal data breach.',
    },
    {
      id: 'retention',
      title: '4. Data Retention and Deletion',
      content:
        'Processor shall retain personal data for a period of {{retention_period}}. Upon expiry of the retention period or termination of the underlying agreement, Processor shall at Controller\'s choice delete or return all personal data and delete existing copies.',
    },
    {
      id: 'transfers',
      title: '5. International Transfers',
      content:
        'Processor shall not transfer personal data to third countries or international organisations without Controller\'s prior written authorisation and appropriate safeguards in place (such as Standard Contractual Clauses).',
    },
    {
      id: 'governing_law',
      title: '6. Governing Law',
      content:
        'This DPA shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    sigSection('controller_name', 'processor_name'),
  ],
}

export const businessAssociateAgreementTemplate: DocTemplate = {
  id: 'business_associate_agreement',
  name: 'Business Associate Agreement',
  variables: [
    { key: 'covered_entity_name', label: 'Covered Entity — Full Legal Name', type: 'text', required: true },
    { key: 'covered_entity_address', label: 'Covered Entity — Address', type: 'text', required: true },
    { key: 'business_associate_name', label: 'Business Associate — Full Legal Name', type: 'text', required: true },
    { key: 'business_associate_address', label: 'Business Associate — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'services_description', label: 'Services Involving PHI', type: 'text', required: true },
    { key: 'phi_types', label: 'Types of Protected Health Information', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Business Associate Agreement ("BAA") is entered into as of {{effective_date}} between {{covered_entity_name}}, located at {{covered_entity_address}} ("Covered Entity"), and {{business_associate_name}}, located at {{business_associate_address}} ("Business Associate"), pursuant to the Health Insurance Portability and Accountability Act of 1996 ("HIPAA").',
    },
    {
      id: 'services',
      title: '2. Services and PHI',
      content:
        'Business Associate provides the following services to Covered Entity that involve Protected Health Information ("PHI"): {{services_description}}. The following types of PHI may be created, received, maintained, or transmitted by Business Associate: {{phi_types}}.',
    },
    {
      id: 'obligations',
      title: '3. Business Associate Obligations',
      content:
        'Business Associate agrees to: (a) not use or disclose PHI other than as permitted or required by this BAA or applicable law; (b) implement appropriate safeguards to prevent unauthorized use or disclosure of PHI; (c) report to Covered Entity any use or disclosure of PHI not provided for by this BAA, including breaches; (d) ensure that any subcontractors agree to the same restrictions and conditions; (e) make PHI available to Covered Entity as necessary for compliance with HIPAA; (f) return or destroy PHI upon termination.',
    },
    {
      id: 'permitted_uses',
      title: '4. Permitted Uses and Disclosures',
      content:
        'Business Associate may use PHI as necessary to perform services for Covered Entity. Business Associate may disclose PHI to subcontractors or agents solely to perform functions or services on behalf of Covered Entity, provided such parties agree to equivalent restrictions.',
    },
    {
      id: 'term',
      title: '5. Term and Termination',
      content:
        'This BAA is effective as of {{effective_date}} and shall remain in effect until terminated. Either party may terminate this BAA upon sixty (60) days written notice. Covered Entity may terminate immediately if Business Associate materially breaches this BAA. Upon termination, Business Associate shall return or destroy all PHI.',
    },
    {
      id: 'governing_law',
      title: '6. Governing Law',
      content:
        'This BAA shall be governed by and construed in accordance with the laws of {{governing_law}} and applicable federal law including HIPAA, without regard to conflict of laws principles.',
    },
    sigSection('covered_entity_name', 'business_associate_name'),
  ],
}

export const aiAddendumTemplate: DocTemplate = {
  id: 'ai_addendum',
  name: 'AI Addendum',
  variables: [
    { key: 'party_a_name', label: 'Party A — Full Legal Name (AI Provider)', type: 'text', required: true },
    { key: 'party_b_name', label: 'Party B — Full Legal Name (Customer)', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'base_agreement_name', label: 'Underlying Agreement Name', type: 'text', required: true },
    { key: 'ai_features_description', label: 'AI / ML Features Covered', type: 'text', required: true },
    { key: 'input_ownership', label: 'Input Ownership', type: 'text', required: true },
    { key: 'output_ownership', label: 'Output Ownership', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'intro',
      title: '1. Introduction',
      content:
        'This AI Addendum ("Addendum") is entered into as of {{effective_date}} between {{party_a_name}} ("AI Provider") and {{party_b_name}} ("Customer"), and supplements the {{base_agreement_name}} (the "Base Agreement"). In the event of any conflict between this Addendum and the Base Agreement with respect to AI-specific matters, this Addendum shall prevail.',
    },
    {
      id: 'ai_features',
      title: '2. AI/ML Features',
      content:
        'This Addendum governs the use of the following artificial intelligence and machine learning features, tools, or services: {{ai_features_description}}. Customer acknowledges that AI-generated outputs may be inaccurate, incomplete, or inappropriate, and should be reviewed by qualified personnel before reliance.',
    },
    {
      id: 'ownership',
      title: '3. Inputs and Outputs',
      content:
        'Inputs: {{input_ownership}}. Outputs: {{output_ownership}}. AI Provider shall not use Customer inputs or outputs to train or improve AI models without Customer\'s explicit prior written consent.',
    },
    {
      id: 'restrictions',
      title: '4. Use Restrictions',
      content:
        'Customer shall not use the AI features for: (a) generating content that is illegal, harmful, or deceptive; (b) decisions that materially affect individuals without human review; (c) any purpose prohibited by applicable law or the Base Agreement. Customer is responsible for ensuring its use of AI-generated outputs complies with applicable regulations.',
    },
    {
      id: 'disclaimer',
      title: '5. AI Disclaimer',
      content:
        'AI FEATURES ARE PROVIDED "AS IS" WITH RESPECT TO AI OUTPUT ACCURACY. AI PROVIDER MAKES NO WARRANTY THAT AI OUTPUTS WILL BE ACCURATE, COMPLETE, OR FIT FOR ANY PARTICULAR PURPOSE. CUSTOMER ASSUMES SOLE RESPONSIBILITY FOR ANY DECISIONS MADE IN RELIANCE ON AI OUTPUTS.',
    },
    {
      id: 'governing_law',
      title: '6. Governing Law',
      content:
        'This Addendum shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    sigSection('party_a_name', 'party_b_name'),
  ],
}
