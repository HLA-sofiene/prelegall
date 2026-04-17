interface SignatureSectionProps {
  title: string
  content: string
}

export default function SignatureSection({ title, content }: SignatureSectionProps) {
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
