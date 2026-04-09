'use client'

import { forwardRef } from 'react'
import { mutualNdaTemplate } from '@/lib/mutualNdaTemplate'
import { renderSection } from '@/lib/renderTemplate'
import type { FormValues } from '@/lib/renderTemplate'

interface NdaPreviewProps {
  values: FormValues
}

const NdaPreview = forwardRef<HTMLDivElement, NdaPreviewProps>(({ values }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white font-serif text-gray-900 p-10 min-h-full"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* Document header */}
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold uppercase tracking-wide">
          Mutual Non-Disclosure Agreement
        </h1>
        {values.effective_date && (
          <p className="text-sm text-gray-600 mt-2">
            Effective Date:{' '}
            {new Date(values.effective_date + 'T00:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-5 text-sm leading-relaxed">
        {mutualNdaTemplate.sections.map((section) => {
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
})

NdaPreview.displayName = 'NdaPreview'

export default NdaPreview

function SignatureSection({ title, content }: { title: string; content: string }) {
  const blocks = content.split('\n\n').filter(Boolean)

  return (
    <div className="mt-8">
      <p className="font-semibold mb-4">{title}</p>
      <p className="mb-6 text-justify">{blocks[0]}</p>
      <div className="grid grid-cols-2 gap-10">
        {blocks.slice(1).map((block, i) => {
          const lines = block.split('\n').filter(Boolean)
          return (
            <div key={i} className="space-y-2">
              {lines.map((line, j) => (
                <p key={j} className="text-sm border-b border-gray-400 pb-1">
                  {line}
                </p>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
