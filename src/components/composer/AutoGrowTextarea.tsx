import { useRef, useEffect, useCallback, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

interface AutoGrowTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onGenerate'> {
    minHeight?: number
    maxHeight?: number
    onGenerate?: () => void
}

export function AutoGrowTextarea({
    className,
    minHeight = 120,
    maxHeight = 500,
    onGenerate,
    ...props
}: AutoGrowTextareaProps) {
    const textRef = useRef<HTMLTextAreaElement>(null)

    const resize = useCallback(() => {
        const el = textRef.current
        if (!el) return
        el.style.height = '0px'
        const scrollH = el.scrollHeight
        const h = Math.min(scrollH, maxHeight)
        el.style.height = `${Math.max(minHeight, h)}px`
        el.style.overflowY = scrollH > maxHeight ? 'auto' : 'hidden'
    }, [minHeight, maxHeight])

    useEffect(() => {
        resize()
    }, [props.value, resize])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                onGenerate?.()
            }
            props.onKeyDown?.(e)
        },
        [onGenerate, props.onKeyDown],
    )

    const maxVh = `min(${maxHeight}px, 45vh)`

    return (
        <textarea
            ref={textRef}
            className={cn(
                'w-full resize-none rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-base text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50',
                'min-h-[120px]',
                'scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent',
                className,
            )}
            style={{ maxHeight: maxVh }}
            onInput={resize}
            onKeyDown={handleKeyDown}
            {...props}
        />
    )
}
