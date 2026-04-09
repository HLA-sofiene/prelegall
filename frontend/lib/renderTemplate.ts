export type FormValues = Record<string, string>

export function renderSection(content: string, values: FormValues): string {
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = values[key]
    return val && val.trim() !== '' ? val : `[${key.replace(/_/g, ' ')}]`
  })
}
