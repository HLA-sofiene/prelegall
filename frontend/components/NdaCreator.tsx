'use client'

import { useMemo, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import NdaChat from './NdaChat'
import NdaPreview from './NdaPreview'
import type { FormValues } from '@/lib/renderTemplate'
import { mutualNdaTemplate } from '@/lib/mutualNdaTemplate'

function buildInitialValues(): FormValues {
  return Object.fromEntries(
    mutualNdaTemplate.variables.map((v) => [v.key, v.default != null ? String(v.default) : ''])
  )
}

function getMissingLabels(values: FormValues): string[] {
  return mutualNdaTemplate.variables
    .filter((v) => v.required && (!values[v.key] || values[v.key].trim() === ''))
    .map((v) => v.label)
}

const REQUIRED_COUNT = mutualNdaTemplate.variables.filter((v) => v.required).length

export default function NdaCreator() {
  const [values, setValues] = useState<FormValues>(buildInitialValues)
  const previewRef = useRef<HTMLDivElement>(null)

  const triggerPrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: 'Mutual_NDA',
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      body { font-family: Georgia, "Times New Roman", serif; font-size: 11pt; }
    `,
  })

  function handleFieldsUpdate(fields: Partial<FormValues>) {
    const defined = Object.fromEntries(
      Object.entries(fields).filter((entry): entry is [string, string] => entry[1] !== undefined)
    )
    setValues((prev) => ({ ...prev, ...defined }))
  }

  const missing = useMemo(() => getMissingLabels(values), [values])
  const filledCount = REQUIRED_COUNT - missing.length
  const isComplete = missing.length === 0

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left panel — AI chat */}
      <aside className="w-96 shrink-0 flex flex-col border-r border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="shrink-0 border-b border-gray-200 px-6 py-4">
          <h1 className="text-base font-bold" style={{ color: '#032147' }}>Mutual NDA Creator</h1>
          <p className="text-xs mt-0.5" style={{ color: '#888888' }}>Chat with AI to draft your agreement</p>
        </div>
        <div className="flex-1 overflow-hidden px-4 py-4">
          <NdaChat values={values} onFieldsUpdate={handleFieldsUpdate} />
        </div>
      </aside>

      {/* Right panel — preview */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Preview toolbar */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
            {!isComplete && (
              <span className="text-xs text-gray-400">
                {filledCount}/{REQUIRED_COUNT} fields
              </span>
            )}
          </div>
          {isComplete && (
            <button
              onClick={() => triggerPrint()}
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
              style={{ backgroundColor: '#753991' }}
            >
              <PrintIcon />
              Download PDF
            </button>
          )}
        </div>

        {/* Scrollable preview area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl shadow-lg ring-1 ring-gray-200 rounded-sm">
            <NdaPreview ref={previewRef} values={values} />
          </div>
        </div>
      </main>
    </div>
  )
}

function PrintIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )
}
