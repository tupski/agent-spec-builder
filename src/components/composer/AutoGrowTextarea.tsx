import { useRef, useEffect, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

interface AutoGrowTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxHeight?: string
}

export function AutoGrowTextarea({
    className,
    maxHeight = '45vh',
    ...props
}: AutoGrowTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const resize = () => {
        const el = textareaRef.current
        if (!el) return
        el.style.height = 'auto'
        el.style.height = `${Math.min(el.scrollHeight, parseFloat(maxHeight))}px`
        el.style.overflowY = el.scrollHeight > parseFloat(maxHeight) ? 'auto' : 'hidden'
    }

    useEffect(() => {
        resize()
    }, [props.value])

    return (
        <textarea
            ref={textareaRef}
            className={cn(
                'w-full resize-none rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-base text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 min-h-[120px]',
                className
            )}
            onInput={resize}
            {...props}
        />
    )
}
