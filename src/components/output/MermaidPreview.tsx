import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils/cn'

interface MermaidPreviewProps {
    content: string
    className?: string
}

export function MermaidPreview({ content, className }: MermaidPreviewProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false

        const renderMermaid = async () => {
            try {
                setLoading(true)
                setError(null)

                const mermaidModule = await import('mermaid')
                const mermaid = mermaidModule.default

                // Initialize once (idempotent after first call)
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

                if (cancelled || !containerRef.current) return

                const { svg } = await mermaid.render('mermaid-svg', content)
                if (!cancelled && containerRef.current) {
                    containerRef.current.innerHTML = svg
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Mermaid render error:', err)
                    setError('Failed to render diagram')
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        renderMermaid()

        return () => {
            cancelled = true
        }
    }, [content])

    if (loading) {
        return (
            <div className={cn('flex items-center justify-center py-6 text-xs text-slate-500', className)}>
                Loading diagram...
            </div>
        )
    }

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
