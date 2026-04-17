import type { DocTemplate } from './renderTemplate'

export const pilotAgreementTemplate: DocTemplate = {
  id: 'pilot_agreement',
  name: 'Pilot Agreement',
  variables: [
    { key: 'provider_name', label: 'Provider — Full Legal Name', type: 'text', required: true },
    { key: 'provider_address', label: 'Provider — Address', type: 'text', required: true },
    { key: 'customer_name', label: 'Customer — Full Legal Name', type: 'text', required: true },
    { key: 'customer_address', label: 'Customer — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Pilot Start Date', type: 'date', required: true },
    { key: 'pilot_duration_days', label: 'Pilot Duration (days)', type: 'number', required: true, default: 30 },
    { key: 'service_description', label: 'Description of Service Being Piloted', type: 'text', required: true },
    { key: 'success_criteria', label: 'Pilot Success Criteria', type: 'text', required: true },
    { key: 'pilot_fees', label: 'Pilot Fees', type: 'text', required: true },
    { key: 'governing_law', label: 'Governing Law', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Pilot Agreement ("Agreement") is entered into as of {{effective_date}} between {{provider_name}}, located at {{provider_address}} ("Provider"), and {{customer_name}}, located at {{customer_address}} ("Customer").',
    },
    {
      id: 'pilot_access',
      title: '2. Pilot Access',
      content:
        'Provider hereby grants Customer a limited, non-exclusive, non-transferable right to access and evaluate the following service during the Pilot Period: {{service_description}} (the "Service"). This access is provided solely for Customer\'s internal evaluation purposes and not for production use or commercial benefit.',
    },
    {
      id: 'evaluation_period',
      title: '3. Evaluation Period',
      content:
        'The pilot period shall commence on {{effective_date}} and continue for {{pilot_duration_days}} days (the "Pilot Period"), unless terminated earlier in accordance with this Agreement. The parties may agree in writing to extend the Pilot Period. Upon expiration of the Pilot Period, Customer\'s access to the Service shall automatically terminate unless the parties enter into a separate commercial agreement.',
    },
    {
      id: 'success_criteria',
      title: '4. Success Criteria',
      content:
        'The parties agree that success of the pilot shall be evaluated based on the following criteria: {{success_criteria}}. Customer shall conduct a good-faith evaluation of the Service during the Pilot Period and provide Provider with written feedback regarding the Service\'s performance against these criteria within ten (10) business days following the end of the Pilot Period.',
    },
    {
      id: 'fees',
      title: '5. Fees',
      content:
        'In consideration for access to the Service during the Pilot Period, Customer shall pay Provider the following amount: {{pilot_fees}}. If no fees are specified above, access is provided at no charge. All fees, if any, are due within thirty (30) days of invoice.',
    },
    {
      id: 'ip',
      title: '6. Intellectual Property',
      content:
        'Provider retains all right, title, and interest in and to the Service and all related intellectual property. No rights are granted to Customer except as expressly set forth in this Agreement. Customer retains all rights in any data it provides or generates during the Pilot Period.',
    },
    {
      id: 'confidentiality',
      title: '7. Confidentiality',
      content:
        'Each party agrees to hold in confidence the other party\'s Confidential Information and not to disclose it to any third party or use it for any purpose other than evaluating the Service under this Agreement. The terms of this Agreement are confidential. Customer acknowledges that the Service may contain pre-release features that constitute Provider\'s Confidential Information.',
    },
    {
      id: 'feedback',
      title: '8. Feedback',
      content:
        'Customer may, at its discretion, provide Provider with suggestions, comments, or other feedback about the Service ("Feedback"). Customer grants Provider a perpetual, irrevocable, royalty-free license to use, incorporate, and commercialize any Feedback without restriction or obligation to Customer.',
    },
    {
      id: 'liability',
      title: '9. Limitation of Liability',
      content:
        'THE SERVICE IS PROVIDED "AS IS" DURING THE PILOT PERIOD WITHOUT WARRANTY OF ANY KIND. PROVIDER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM CUSTOMER\'S USE OF OR INABILITY TO USE THE SERVICE. PROVIDER\'S AGGREGATE LIABILITY SHALL NOT EXCEED THE TOTAL FEES PAID BY CUSTOMER UNDER THIS AGREEMENT.',
    },
    {
      id: 'governing_law',
      title: '10. Governing Law',
      content:
        'This Agreement shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    {
      id: 'signatures',
      title: 'Signatures',
      content:
        'IN WITNESS WHEREOF, the parties have executed this Pilot Agreement as of the date first written above.\n\n{{provider_name}}\nSignature: _______________________\nName: ___________________________\nTitle: ___________________________\nDate: ____________________________\n\n{{customer_name}}\nSignature: _______________________\nName: ___________________________\nTitle: ___________________________\nDate: ____________________________',
    },
  ],
}
