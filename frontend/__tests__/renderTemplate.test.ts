import { describe, it, expect } from 'vitest'
import { renderSection } from '@/lib/renderTemplate'

describe('renderSection', () => {
  it('substitutes a single variable', () => {
    expect(renderSection('Hello {{name}}', { name: 'Alice' })).toBe('Hello Alice')
  })

  it('substitutes multiple variables', () => {
    const result = renderSection('{{party_a}} and {{party_b}}', {
      party_a: 'Acme Corp',
      party_b: 'Globex Inc',
    })
    expect(result).toBe('Acme Corp and Globex Inc')
  })

  it('substitutes the same variable appearing more than once', () => {
    const result = renderSection('{{x}} meets {{x}}', { x: 'Alice' })
    expect(result).toBe('Alice meets Alice')
  })

  it('falls back to [key label] when variable is missing from values', () => {
    expect(renderSection('Signed by {{party_a_name}}', {})).toBe('Signed by [party a name]')
  })

  it('falls back when variable is an empty string', () => {
    expect(renderSection('Date: {{effective_date}}', { effective_date: '' })).toBe(
      'Date: [effective date]'
    )
  })

  it('falls back when variable is whitespace-only', () => {
    expect(renderSection('Law: {{governing_law}}', { governing_law: '   ' })).toBe(
      'Law: [governing law]'
    )
  })

  it('converts underscores to spaces in the fallback label', () => {
    expect(renderSection('{{duration_years}} years', {})).toBe('[duration years] years')
  })

  it('leaves plain text untouched when there are no placeholders', () => {
    const text = 'No placeholders here.'
    expect(renderSection(text, { anything: 'ignored' })).toBe(text)
  })

  it('returns an empty string unchanged', () => {
    expect(renderSection('', {})).toBe('')
  })

  it('does not match partial or malformed placeholders', () => {
    expect(renderSection('{{missing_brace}', { missing_brace: 'x' })).toBe('{{missing_brace}')
    expect(renderSection('{single_brace}', { single_brace: 'x' })).toBe('{single_brace}')
  })
})
