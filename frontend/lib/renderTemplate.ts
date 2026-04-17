export type FormValues = Record<string, string>

export interface DocVariable {
  key: string
  label: string
  type: 'text' | 'date' | 'number'
  required: boolean
  default?: string | number
}

export interface DocSection {
  id: string
  title: string
  content: string
}

export interface DocTemplate {
  id: string
  name: string
  variables: DocVariable[]
  sections: DocSection[]
}

export function renderSection(content: string, values: FormValues): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = values[key]
    return val && val.trim() !== '' ? val : `[${key.replace(/_/g, ' ')}]`
  })
}
