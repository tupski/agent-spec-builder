import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { cn } from '../../lib/utils/cn'

// Initialize mermaid once
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        background: '#1e293b',
        primaryColor: '#0ea5e9',
        primaryTextColor: '#f1f5f9',
        primaryBorderColor: '#334155',
        lineColor: '#64748b',
        secondaryColor: '#334155',
        tertiaryColor: '#0f172a',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
})

interface MermaidPreviewProps {
    content: string
    className?: string
}

export function MermaidPreview({ content, className }: MermaidPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!containerRef.current) return

        const renderMermaid = async () => {
            try {
                setError(null)
                const { svg } = await mermaid.render('mermaid-svg', content)
                if (containerRef.current) {
                    containerRef.current.innerHTML = svg
                }
            } catch (err) {
                console.error('Mermaid render error:', err)
                setError('Failed to render diagram')
            }
        }

        renderMermaid()
    }, [content])

    if (error) {
        return (
            <div className={cn('rounded-lg border border-red-700/50 bg-red-900/20 p-3', className)}>
                <p className="text-sm text-red-400">{error}</p>
                <pre className="mt-2 text-xs text-slate-400 overflow-x-auto">{content}</pre>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className={cn('overflow-x-auto py-2', className)}
        />
    )
}
