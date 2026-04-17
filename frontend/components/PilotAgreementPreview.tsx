'use client'

import { forwardRef } from 'react'
import { pilotAgreementTemplate } from '@/lib/pilotAgreementTemplate'
import { renderSection } from '@/lib/renderTemplate'
import type { FormValues } from '@/lib/renderTemplate'
import SignatureSection from './SignatureSection'

interface PilotAgreementPreviewProps {
  values: FormValues
}

const PilotAgreementPreview = forwardRef<HTMLDivElement, PilotAgreementPreviewProps>(
  ({ values }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white font-serif text-gray-900 p-10 min-h-full"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {/* Document header */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold uppercase tracking-wide">Pilot Agreement</h1>
          {values.effective_date && (
            <p className="text-sm text-gray-600 mt-2">
              Pilot Start Date:{' '}
              {new Date(values.effective_date + 'T00:00:00').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          {values.provider_name && values.customer_name && (
            <p className="text-sm text-gray-600 mt-1">
              {values.provider_name} &amp; {values.customer_name}
            </p>
          )}
          {values.pilot_duration_days && (
            <p className="text-sm text-gray-500 mt-1">
              Pilot Duration: {values.pilot_duration_days} days
            </p>
          )}
        </div>

        {/* Sections */}
        <div className="space-y-5 text-sm leading-relaxed">
          {pilotAgreementTemplate.sections.map((section) => {
            const rendered = renderSection(section.content, values)

            if (section.id === 'signatures') {
              return <SignatureSection key={section.id} title={section.title} content={rendered} />
            }

            return (
              <div key={section.id}>
                <p className="font-semibold mb-1">{section.title}</p>
                <p className="text-justify">{rendered}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

PilotAgreementPreview.displayName = 'PilotAgreementPreview'

export default PilotAgreementPreview
