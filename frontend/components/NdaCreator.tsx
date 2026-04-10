'use client'

import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import NdaForm from './NdaForm'
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

export default function NdaCreator() {
  const [values, setValues] = useState<FormValues>(buildInitialValues)
  const [validationError, setValidationError] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const triggerPrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: 'Mutual_NDA',
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      body { font-family: Georgia, "Times New Roman", serif; font-size: 11pt; }
    `,
  })

  function handleChange(key: string, value: string) {
    setValidationError(null)
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleDownload() {
    const missing = getMissingLabels(values)
    if (missing.length > 0) {
      setValidationError(`Please fill in: ${missing.join(', ')}`)
      return
    }
    setValidationError(null)
    triggerPrint()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left panel — form */}
      <aside className="w-96 shrink-0 overflow-y-auto border-r border-gray-200 bg-white shadow-sm">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-base font-bold text-gray-900">Mutual NDA Creator</h1>
          <p className="text-xs text-gray-500 mt-0.5">Fill in the fields to generate your agreement</p>
        </div>
        <div className="px-6 py-5">
          <NdaForm values={values} onChange={handleChange} />
        </div>
      </aside>

      {/* Right panel — preview */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Preview toolbar */}
        <div className="shrink-0 flex flex-col gap-2 border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 active:bg-indigo-700 transition-colors"
            >
              <PrintIcon />
              Download PDF
            </button>
          </div>
          {validationError && (
            <p className="text-xs text-red-600">{validationError}</p>
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
