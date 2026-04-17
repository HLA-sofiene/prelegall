import type { DocTemplate } from './renderTemplate'

export const cloudServiceAgreementTemplate: DocTemplate = {
  id: 'cloud_service_agreement',
  name: 'Cloud Service Agreement',
  variables: [
    { key: 'provider_name', label: 'Provider — Full Legal Name', type: 'text', required: true },
    { key: 'provider_address', label: 'Provider — Address', type: 'text', required: true },
    { key: 'customer_name', label: 'Customer — Full Legal Name', type: 'text', required: true },
    { key: 'customer_address', label: 'Customer — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'service_description', label: 'Description of Cloud Services', type: 'text', required: true },
    { key: 'subscription_term_months', label: 'Subscription Term (months)', type: 'number', required: true, default: 12 },
    { key: 'fees', label: 'Subscription Fees', type: 'text', required: true },
    { key: 'payment_terms', label: 'Payment Terms', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Cloud Service Agreement ("Agreement") is entered into as of {{effective_date}} between {{provider_name}}, located at {{provider_address}} ("Provider"), and {{customer_name}}, located at {{customer_address}} ("Customer").',
    },
    {
      id: 'services',
      title: '2. Cloud Services',
      content:
        'Provider shall make the following cloud services available to Customer on a subscription basis: {{service_description}} (the "Services"). Provider will use commercially reasonable efforts to ensure the Services are available and performing in accordance with this Agreement.',
    },
    {
      id: 'access',
      title: '3. Access and Use Rights',
      content:
        'Subject to the terms of this Agreement and timely payment of all fees, Provider grants Customer a non-exclusive, non-transferable right to access and use the Services during the subscription term solely for Customer\'s internal business purposes. Customer shall not: (a) sublicense, resell, or transfer the Services to any third party; (b) reverse engineer, decompile, or disassemble any component of the Services; (c) use the Services in violation of applicable law; or (d) use the Services to store or transmit malicious code.',
    },
    {
      id: 'fees',
      title: '4. Fees and Payment',
      content:
        'Customer shall pay Provider the subscription fees of {{fees}} for the Services. Payment shall be due in accordance with the following terms: {{payment_terms}}. All fees are non-refundable except as expressly set forth herein. Provider reserves the right to suspend access to the Services upon ten (10) days\' written notice if Customer fails to pay undisputed fees when due.',
    },
    {
      id: 'data',
      title: '5. Data and Security',
      content:
        'Customer retains all right, title, and interest in and to any data submitted to the Services by or on behalf of Customer ("Customer Data"). Provider shall implement commercially reasonable technical and organizational security measures designed to protect Customer Data against unauthorized access, use, or disclosure. Provider shall process Customer Data only as directed by Customer and as necessary to provide the Services.',
    },
    {
      id: 'confidentiality',
      title: '6. Confidentiality',
      content:
        'Each party agrees to hold in confidence and not disclose to any third party the other party\'s Confidential Information, and to use such Confidential Information only for purposes of this Agreement. "Confidential Information" means any information disclosed by one party to the other that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information.',
    },
    {
      id: 'ip',
      title: '7. Intellectual Property',
      content:
        'Provider retains all right, title, and interest in and to the Services and all related intellectual property, including any improvements or modifications. Customer grants Provider a limited license to process Customer Data solely to provide the Services. No rights are granted to Customer in the Services except as expressly set forth herein.',
    },
    {
      id: 'term',
      title: '8. Term and Termination',
      content:
        'The initial subscription term of this Agreement is {{subscription_term_months}} months commencing on the effective date. Either party may terminate this Agreement upon thirty (30) days\' written notice if the other party materially breaches this Agreement and fails to cure such breach within that period. Upon termination, Customer\'s right to access the Services shall immediately cease, and Provider will make Customer Data available for export for a period of thirty (30) days.',
    },
    {
      id: 'liability',
      title: '9. Limitation of Liability',
      content:
        'EXCEPT FOR EITHER PARTY\'S GROSS NEGLIGENCE, WILLFUL MISCONDUCT, OR INDEMNIFICATION OBLIGATIONS, IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. EACH PARTY\'S AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.',
    },
    {
      id: 'governing_law',
      title: '10. Governing Law',
      content:
        'This Agreement shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    {
      id: 'entire_agreement',
      title: '11. Entire Agreement',
      content:
        'This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions. Any amendment must be in writing and signed by both parties.',
    },
    {
      id: 'signatures',
      title: 'Signatures',
      content:
        'IN WITNESS WHEREOF, the parties have executed this Cloud Service Agreement as of the date first written above.\n\n{{provider_name}}\nSignature: _______________________\nName: ___________________________\nTitle: ___________________________\nDate: ____________________________\n\n{{customer_name}}\nSignature: _______________________\nName: ___________________________\nTitle: ___________________________\nDate: ____________________________',
    },
  ],
}
