'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormValues } from '@/lib/renderTemplate'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface NdaChatProps {
  values: FormValues
  onFieldsUpdate: (fields: Partial<FormValues>) => void
}

export default function NdaChat({ values, onFieldsUpdate }: NdaChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  // Always reflect the latest values prop so callApi never uses a stale snapshot
  const valuesRef = useRef(values)
  useEffect(() => { valuesRef.current = values }, [values])

  // Fetch initial greeting on mount
  useEffect(() => {
    callApi([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function callApi(msgs: Message[]) {
    setIsLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, current_fields: valuesRef.current }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
      if (data.fields && Object.keys(data.fields).length > 0) {
        onFieldsUpdate(data.fields)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    await callApi(updated)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
        {messages.length === 0 && isLoading && <TypingIndicator />}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
              style={
                msg.role === 'user'
                  ? { backgroundColor: '#209dd7', color: '#ffffff' }
                  : { backgroundColor: '#f3f4f6', color: '#1f2937' }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-gray-200 pt-3">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type your message…"
            rows={2}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#753991' }}
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-lg px-3 py-2.5" style={{ backgroundColor: '#f3f4f6' }}>
        <div className="flex gap-1 items-center h-3">
          {[0, 150, 300].map((delay) => (
            <div
              key={delay}
              className="w-1.5 h-1.5 rounded-full animate-bounce"
              style={{ backgroundColor: '#9ca3af', animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
