'use client'

import { mutualNdaTemplate } from '@/lib/mutualNdaTemplate'
import type { NdaVariable } from '@/lib/mutualNdaTemplate'
import type { FormValues } from '@/lib/renderTemplate'

interface NdaFormProps {
  values: FormValues
  onChange: (key: string, value: string) => void
}

const byKey: Record<string, NdaVariable | undefined> = Object.fromEntries(
  mutualNdaTemplate.variables.map((v) => [v.key, v])
)

const PARTY_A_KEYS = ['party_a_name', 'party_a_address'] as const
const PARTY_B_KEYS = ['party_b_name', 'party_b_address'] as const
const DETAIL_KEYS = ['effective_date', 'purpose', 'duration_years', 'governing_law'] as const

export default function NdaForm({ values, onChange }: NdaFormProps) {
  return (
    <div className="space-y-5">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Party A</h2>
        <p className="text-sm text-gray-500 mt-0.5">First disclosing / receiving party</p>
      </div>

      {PARTY_A_KEYS.map((key) => (
        <Field key={key} variable={byKey[key]} value={values[key] ?? ''} onChange={(v) => onChange(key, v)} />
      ))}

      <div className="border-b border-gray-200 pb-4 pt-2">
        <h2 className="text-lg font-semibold text-gray-800">Party B</h2>
        <p className="text-sm text-gray-500 mt-0.5">Second disclosing / receiving party</p>
      </div>

      {PARTY_B_KEYS.map((key) => (
        <Field key={key} variable={byKey[key]} value={values[key] ?? ''} onChange={(v) => onChange(key, v)} />
      ))}

      <div className="border-b border-gray-200 pb-4 pt-2">
        <h2 className="text-lg font-semibold text-gray-800">Agreement Details</h2>
      </div>

      {DETAIL_KEYS.map((key) => (
        <Field key={key} variable={byKey[key]} value={values[key] ?? ''} onChange={(v) => onChange(key, v)} />
      ))}
    </div>
  )
}

interface FieldProps {
  variable: NdaVariable | undefined
  value: string
  onChange: (value: string) => void
}

function Field({ variable, value, onChange }: FieldProps) {
  if (!variable) return null
  const inputClass =
    'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm ' +
    'focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 ' +
    'placeholder-gray-400'

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {variable.label}
        {variable.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {variable.type === 'text' && (
        <input
          type="text"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={variable.label}
          required={variable.required}
        />
      )}

      {variable.type === 'date' && (
        <input
          type="date"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={variable.required}
        />
      )}

      {variable.type === 'number' && (
        <input
          type="number"
          min={1}
          max={20}
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={variable.required}
        />
      )}
    </div>
  )
}
