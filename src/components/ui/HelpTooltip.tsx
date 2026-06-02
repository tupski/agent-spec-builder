import { useState, useRef, useEffect, useCallback } from 'react'
import { CircleHelp } from 'lucide-react'
import { t, type Lang } from '../../lib/i18n/translations'

type Props = {
    tooltipId: string
    lang: Lang
}

export function HelpTooltip({ tooltipId, lang }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const toggle = useCallback(() => setOpen((v) => !v), [])

    useEffect(() => {
        if (!open) return
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEsc)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEsc)
        }
    }, [open])

    const helpKey = `help${tooltipId.charAt(0).toUpperCase() + tooltipId.slice(1)}`
    const text = t(lang, helpKey)

    if (!text || text === helpKey) return null

    return (
        <div ref={ref} className="relative inline-flex items-center">
            <span
                role="button"
                tabIndex={0}
                onClick={toggle}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } }}
                className="inline-flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 rounded"
                aria-label={text}
            >
                <CircleHelp className="h-3.5 w-3.5" />
            </span>
            {open && (
                <div className="absolute left-0 top-full mt-2 z-50 w-64 max-w-[90vw] rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-slate-200 shadow-xl pointer-events-none">
                    {text}
                </div>
            )}
        </div>
    )
}
