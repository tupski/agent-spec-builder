import { useState, useRef, useEffect, useCallback } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check, ChevronDown } from 'lucide-react'
import { ALL_OUTPUT_DOCS, FULL_PACKAGE_DOCS } from '../../types'
import type { OutputDocument } from '../../types'
import { t, type Lang } from '../../lib/i18n/translations'
import { HelpTooltip } from '../ui/HelpTooltip'

type Props = {
    value: OutputDocument[]
    onChange: (docs: OutputDocument[]) => void
    lang: Lang
}

export function OutputSelector({ value, onChange, lang }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    // Full Package = ALL main docs selected AND no extra docs selected
    const isFullPackage =
        FULL_PACKAGE_DOCS.every((d) => value.includes(d)) &&
        value.every((d) => ALL_OUTPUT_DOCS.includes(d))

    const toggleFullPackage = useCallback(
        (checked: boolean) => {
            if (checked) {
                onChange([...FULL_PACKAGE_DOCS])
            } else {
                onChange([])
            }
        },
        [onChange],
    )

    const toggleDoc = useCallback(
        (doc: OutputDocument) => {
            const next = value.includes(doc)
                ? value.filter((d) => d !== doc)
                : [...value, doc]
            onChange(next)
        },
        [value, onChange],
    )

    const handleSelectAll = useCallback(() => {
        onChange([...ALL_OUTPUT_DOCS])
    }, [onChange])

    const handleClear = useCallback(() => {
        onChange([])
    }, [onChange])

    // Summary label
    let summary: string
    if (isFullPackage) {
        summary = t(lang, 'fullPackage')
    } else if (value.length === 0) {
        summary = `0 ${t(lang, 'documentsSelected')}`
    } else if (value.length <= 3) {
        summary = value.join(', ')
    } else {
        summary = `${value.length} ${t(lang, 'documentsSelected')}`
    }

    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                {t(lang, 'outputDocuments')}
                <HelpTooltip tooltipId="outputDocuments" lang={lang} />
            </label>
            <div ref={ref} className="relative">
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 hover:border-slate-600 transition-colors"
                >
                    <span className="truncate text-xs">{summary}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-slate-700 bg-slate-800 shadow-xl max-w-[calc(100vw-2rem)]">
                        <div className="max-h-60 overflow-y-auto p-2">
                            {/* Full Package */}
                            <label className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-700/50 cursor-pointer text-sm text-slate-200">
                                <Checkbox.Root
                                    checked={isFullPackage}
                                    onCheckedChange={(c) => toggleFullPackage(c === true)}
                                    className="flex h-4 w-4 items-center justify-center rounded border border-slate-500 bg-slate-800 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                >
                                    <Checkbox.Indicator>
                                        <Check className="h-3 w-3 text-white" />
                                    </Checkbox.Indicator>
                                </Checkbox.Root>
                                <span className="font-medium text-cyan-400">{t(lang, 'fullPackage')}</span>
                            </label>

                            {/* Select all / Clear */}
                            <div className="flex gap-2 px-2 py-1">
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    {t(lang, 'selectAll')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {t(lang, 'clear')}
                                </button>
                            </div>

                            <div className="border-t border-slate-700/50 my-1" />
                            {ALL_OUTPUT_DOCS.map((doc) => (
                                <label
                                    key={doc}
                                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-700/50 cursor-pointer text-sm text-slate-300"
                                >
                                    <Checkbox.Root
                                        checked={value.includes(doc)}
                                        onCheckedChange={() => toggleDoc(doc)}
                                        className="flex h-4 w-4 items-center justify-center rounded border border-slate-500 bg-slate-800 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                    >
                                        <Checkbox.Indicator>
                                            <Check className="h-3 w-3 text-white" />
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    {doc}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
