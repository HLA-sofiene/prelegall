'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormValues } from '@/lib/renderTemplate'

interface SavedDocument {
  id: number
  name: string
  doc_type: string
  fields: FormValues
  created_at: string
  updated_at: string
}

interface MyDocumentsModalProps {
  onClose: () => void
  onLoad: (docType: string, fields: FormValues) => void
}

export default function MyDocumentsModal({ onClose, onLoad }: MyDocumentsModalProps) {
  const [docs, setDocs] = useState<SavedDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/documents', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load documents')
        return r.json()
      })
      .then(setDocs)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false))
  }, [])

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose()
  }

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.stopPropagation()
    setDeletingId(id)
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Delete failed')
      setDocs((prev) => prev.filter((d) => d.id !== id))
    } catch {
      setError('Failed to delete document')
    } finally {
      setDeletingId(null)
    }
  }

  function handleLoad(doc: SavedDocument) {
    onLoad(doc.doc_type, doc.fields)
    onClose()
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  function docTypeLabel(slug: string) {
    return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-bold" style={{ color: '#032147' }}>My Documents</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 transition-colors hover:bg-gray-100"
            style={{ color: '#888888' }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading && (
            <p className="text-sm text-center py-8" style={{ color: '#888888' }}>Loading…</p>
          )}
          {error && (
            <p className="text-sm text-red-600 text-center py-4">{error}</p>
          )}
          {!isLoading && !error && docs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: '#888888' }}>No saved documents yet.</p>
              <p className="text-xs mt-1" style={{ color: '#888888' }}>
                Complete a document and click &quot;Save&quot; to store it here.
              </p>
            </div>
          )}
          {!isLoading && docs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleLoad(doc)}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-2 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#032147' }}>
                  {doc.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#888888' }}>
                  {docTypeLabel(doc.doc_type)} · {formatDate(doc.updated_at)}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(doc.id, e)}
                disabled={deletingId === doc.id}
                className="ml-4 shrink-0 rounded-md p-1.5 transition-colors hover:bg-red-50 disabled:opacity-40"
                style={{ color: '#888888' }}
                title="Delete document"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
