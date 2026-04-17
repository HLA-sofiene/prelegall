'use client'

import { forwardRef, useMemo, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import DocChat from './DocChat'
import NdaPreview from './NdaPreview'
import CloudServiceAgreementPreview from './CloudServiceAgreementPreview'
import PilotAgreementPreview from './PilotAgreementPreview'
import GenericDocPreview from './GenericDocPreview'
import type { FormValues } from '@/lib/renderTemplate'
import { documentRegistry } from '@/lib/documentRegistry'

function buildInitialValues(docType: string | null): FormValues {
  if (!docType) return {}
  const template = documentRegistry[docType]
  if (!template) return {}
  return Object.fromEntries(
    template.variables.map((v) => [v.key, v.default != null ? String(v.default) : ''])
  )
}

function getMissingCount(values: FormValues, docType: string | null): number {
  if (!docType) return 0
  const template = documentRegistry[docType]
  if (!template) return 0
  return template.variables.filter(
    (v) => v.required && (!values[v.key] || values[v.key].trim() === '')
  ).length
}

function getTotalRequired(docType: string | null): number {
  if (!docType) return 0
  const template = documentRegistry[docType]
  if (!template) return 0
  return template.variables.filter((v) => v.required).length
}

export default function DocumentCreator() {
  const [docType, setDocType] = useState<string | null>(null)
  const [values, setValues] = useState<FormValues>({})
  const previewRef = useRef<HTMLDivElement>(null)

  const docName = docType ? (documentRegistry[docType]?.name ?? 'Document') : null

  const triggerPrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: docName?.replace(/\s+/g, '_') ?? 'Document',
    pageStyle: `
      @page { size: A4; margin: 20mm; }
      body { font-family: Georgia, "Times New Roman", serif; font-size: 11pt; }
    `,
  })

  function handleDocTypeDetected(type: string) {
    setDocType(type)
    // Initialise values from the detected template's defaults
    setValues(buildInitialValues(type))
  }

  function handleFieldsUpdate(fields: Partial<FormValues>) {
    const defined = Object.fromEntries(
      Object.entries(fields).filter((entry): entry is [string, string] => entry[1] !== undefined)
    )
    setValues((prev) => ({ ...prev, ...defined }))
  }

  const missingCount = useMemo(() => getMissingCount(values, docType), [values, docType])
  const totalRequired = useMemo(() => getTotalRequired(docType), [docType])
  const filledCount = totalRequired - missingCount
  const isComplete = docType !== null && missingCount === 0

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Left panel — AI chat */}
      <aside className="w-96 shrink-0 flex flex-col border-r border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="shrink-0 border-b border-gray-200 px-6 py-4">
          <h1 className="text-base font-bold" style={{ color: '#032147' }}>
            {docName ? `${docName} Creator` : 'Legal Document Creator'}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: '#888888' }}>
            {docName ? 'Chat with AI to draft your agreement' : 'Tell the AI what document you need'}
          </p>
        </div>
        <div className="flex-1 overflow-hidden px-4 py-4">
          <DocChat
            key={docType ?? '__detecting__'}
            values={values}
            docType={docType}
            onFieldsUpdate={handleFieldsUpdate}
            onDocTypeDetected={handleDocTypeDetected}
          />
        </div>
      </aside>

      {/* Right panel — preview */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Preview toolbar */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Live Preview</span>
            {docType && !isComplete && (
              <span className="text-xs text-gray-400">
                {filledCount}/{totalRequired} fields
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
          {!docType ? (
            <EmptyPreview />
          ) : (
            <div className="mx-auto max-w-3xl shadow-lg ring-1 ring-gray-200 rounded-sm">
              <PreviewRouter docType={docType} values={values} ref={previewRef} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Preview router — selects the right preview component for each doc type
// ---------------------------------------------------------------------------

interface PreviewRouterProps {
  docType: string
  values: FormValues
}

const PreviewRouter = forwardRef<HTMLDivElement, PreviewRouterProps>(({ docType, values }, ref) => {
  if (docType === 'mutual_nda') {
    return <NdaPreview ref={ref} values={values} />
  }
  if (docType === 'cloud_service_agreement') {
    return <CloudServiceAgreementPreview ref={ref} values={values} />
  }
  if (docType === 'pilot_agreement') {
    return <PilotAgreementPreview ref={ref} values={values} />
  }
  const template = documentRegistry[docType]
  if (!template) return null
  return <GenericDocPreview ref={ref} template={template} values={values} />
})

PreviewRouter.displayName = 'PreviewRouter'

// ---------------------------------------------------------------------------
// Empty state shown before doc type is detected
// ---------------------------------------------------------------------------

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-96 text-center px-8">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: '#f0f9ff' }}
      >
        <DocumentIcon />
      </div>
      <h2 className="text-lg font-semibold mb-2" style={{ color: '#032147' }}>
        Your document will appear here
      </h2>
      <p className="text-sm max-w-xs" style={{ color: '#888888' }}>
        Chat with the AI on the left to get started. Tell it what type of legal document you need to draft.
      </p>
    </div>
  )
}

function DocumentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#209dd7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
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
