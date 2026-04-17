import type { DocTemplate } from './renderTemplate'
import { mutualNdaTemplate } from './mutualNdaTemplate'
import { cloudServiceAgreementTemplate } from './cloudServiceAgreementTemplate'
import { pilotAgreementTemplate } from './pilotAgreementTemplate'
import {
  designPartnerAgreementTemplate,
  serviceLevelAgreementTemplate,
  professionalServicesAgreementTemplate,
  partnershipAgreementTemplate,
  softwareLicenseAgreementTemplate,
  dataProcessingAgreementTemplate,
  businessAssociateAgreementTemplate,
  aiAddendumTemplate,
} from './genericTemplates'

export const documentRegistry: Record<string, DocTemplate> = {
  mutual_nda: mutualNdaTemplate,
  cloud_service_agreement: cloudServiceAgreementTemplate,
  pilot_agreement: pilotAgreementTemplate,
  design_partner_agreement: designPartnerAgreementTemplate,
  service_level_agreement: serviceLevelAgreementTemplate,
  professional_services_agreement: professionalServicesAgreementTemplate,
  partnership_agreement: partnershipAgreementTemplate,
  software_license_agreement: softwareLicenseAgreementTemplate,
  data_processing_agreement: dataProcessingAgreementTemplate,
  business_associate_agreement: businessAssociateAgreementTemplate,
  ai_addendum: aiAddendumTemplate,
}

/** Document types that have dedicated, styled preview components */
export const DEDICATED_PREVIEW_TYPES = new Set([
  'mutual_nda',
  'cloud_service_agreement',
  'pilot_agreement',
])
