import type { DocTemplate, DocVariable, DocSection } from './renderTemplate'

// Legacy type aliases kept for backward compatibility
export type NdaVariable = DocVariable
export type NdaSection = DocSection
export type MutualNdaTemplate = DocTemplate

export const mutualNdaTemplate: DocTemplate = {
  id: 'mutual_nda',
  name: 'Mutual Non-Disclosure Agreement',
  variables: [
    { key: 'party_a_name', label: 'Party A — Full Name', type: 'text', required: true },
    { key: 'party_a_address', label: 'Party A — Address', type: 'text', required: true },
    { key: 'party_b_name', label: 'Party B — Full Name', type: 'text', required: true },
    { key: 'party_b_address', label: 'Party B — Address', type: 'text', required: true },
    { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { key: 'purpose', label: 'Purpose of Disclosure', type: 'text', required: true },
    { key: 'duration_years', label: 'Confidentiality Duration (years)', type: 'number', required: true, default: 3 },
    { key: 'governing_law', label: 'Governing Law (State / Country)', type: 'text', required: true },
  ],
  sections: [
    {
      id: 'parties',
      title: '1. Parties',
      content:
        'This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of {{effective_date}} between {{party_a_name}}, located at {{party_a_address}} ("Party A"), and {{party_b_name}}, located at {{party_b_address}} ("Party B"). Party A and Party B are each referred to herein individually as a "Party" and collectively as the "Parties".',
    },
    {
      id: 'purpose',
      title: '2. Purpose',
      content:
        'The Parties wish to explore a potential business relationship and, in connection therewith, each Party may disclose to the other certain confidential and proprietary information for the purpose of {{purpose}} (the "Purpose"). Each Party agrees to receive such information under the terms and conditions of this Agreement.',
    },
    {
      id: 'definition',
      title: '3. Definition of Confidential Information',
      content:
        '"Confidential Information" means any information or data disclosed by either Party to the other that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Confidential Information includes, without limitation, technical data, trade secrets, know-how, research, product plans, products, services, customers, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information.',
    },
    {
      id: 'obligations',
      title: '4. Mutual Obligations',
      content:
        "Each Party (as a \"Receiving Party\" with respect to the other Party's Confidential Information) agrees to: (a) hold the other Party's Confidential Information in strict confidence; (b) not disclose such Confidential Information to any third party without the prior written consent of the disclosing Party; (c) use such Confidential Information solely for the Purpose; (d) limit access to such Confidential Information to those of its employees, contractors, and agents who need such access for the Purpose and who are bound by confidentiality obligations no less restrictive than those set forth herein.",
    },
    {
      id: 'exclusions',
      title: '5. Exclusions',
      content:
        "This Agreement does not apply to information that: (a) is or becomes publicly known through no breach of this Agreement by the Receiving Party; (b) was rightfully known by the Receiving Party without restriction before receipt from the other Party; (c) is rightfully obtained by the Receiving Party from a third party without restriction; or (d) is independently developed by the Receiving Party without use of the other Party's Confidential Information.",
    },
    {
      id: 'term',
      title: '6. Term',
      content:
        'The obligations of each Party under this Agreement shall remain in effect for a period of {{duration_years}} years from the Effective Date, unless terminated earlier by mutual written agreement of both Parties.',
    },
    {
      id: 'return',
      title: '7. Return of Information',
      content:
        "Upon either Party's written request, the other Party shall promptly return or destroy all Confidential Information received and any copies or derivations thereof, and shall certify such destruction in writing upon request.",
    },
    {
      id: 'remedies',
      title: '8. Remedies',
      content:
        'Each Party acknowledges that any breach of this Agreement may cause irreparable harm to the other Party for which monetary damages may be inadequate. Either Party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or equity, without the requirement of posting a bond.',
    },
    {
      id: 'governing_law',
      title: '9. Governing Law',
      content:
        'This Agreement shall be governed by and construed in accordance with the laws of {{governing_law}}, without regard to its conflict of laws principles.',
    },
    {
      id: 'entire_agreement',
      title: '10. Entire Agreement',
      content:
        'This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written. Any amendment to this Agreement must be in writing and signed by both Parties.',
    },
    {
      id: 'signatures',
      title: 'Signatures',
      content:
        'IN WITNESS WHEREOF, the Parties have executed this Mutual Non-Disclosure Agreement as of the date first written above.\n\n{{party_a_name}}\nSignature: _______________________\nName: ___________________________\nTitle: ___________________________\nDate: ____________________________\n\n{{party_b_name}}\nSignature: _______________________\nName: ___________________________\nTitle: ___________________________\nDate: ____________________________',
    },
  ],
}
