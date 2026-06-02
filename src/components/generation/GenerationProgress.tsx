import { useEffect, useRef, useState } from 'react'
import { Check, Loader2, AlertTriangle, X, FileText } from 'lucide-react'
import { useGeneratorStore } from '../../stores/generatorStore'
import { Button } from '../ui/Button'
import { t, type Lang } from '../../lib/i18n/translations'

type Props = {
    lang: Lang
}

export function GenerationProgress({ lang }: Props) {
    const progressStages = useGeneratorStore((s) => s.progressStages)
    const currentProgressEvent = useGeneratorStore((s) => s.currentProgressEvent)
    const activeProgressMessage = useGeneratorStore((s) => s.activeProgressMessage)
    const progressStartedAt = useGeneratorStore((s) => s.progressStartedAt)
    const progressSelectedFiles = useGeneratorStore((s) => s.progressSelectedFiles)
    const isGenerating = useGeneratorStore((s) => s.isGenerating)
    const generationStage = useGeneratorStore((s) => s.generationStage)
    const cancelGeneration = useGeneratorStore((s) => s.cancelGeneration)
    const abortController = useGeneratorStore((s) => s.abortController)

    const [elapsed, setElapsed] = useState('00:00')
    const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

    // Elapsed timer
    useEffect(() => {
        if (!progressStartedAt || !isGenerating) {
            setElapsed('00:00')
            return
        }

        const tick = () => {
            const seconds = Math.floor((Date.now() - progressStartedAt) / 1000)
            const m = String(Math.floor(seconds / 60)).padStart(2, '0')
            const s = String(seconds % 60).padStart(2, '0')
            setElapsed(`${m}:${s}`)
        }

        tick()
        intervalRef.current = setInterval(tick, 1000)

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [progressStartedAt, isGenerating])

    const canCancel = !!abortController && isGenerating
    const isError = generationStage === 'error' || currentProgressEvent === 'error'

    // Find active stage
    const activeStage = progressStages.find((s) => s.status === 'active')
    const completedStages = progressStages.filter((s) => s.status === 'completed')
    const pendingStages = progressStages.filter((s) => s.status === 'pending')

    return (
        <div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-5 md:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        {/* Animated indicator */}
                        <div className="relative">
                            <div className="h-4 w-4 rounded-full bg-cyan-400 animate-pulse-ring" />
                            <div className="absolute inset-0 h-4 w-4 rounded-full bg-cyan-400/40 animate-ping" />
                        </div>
                        <h2 className="text-lg md:text-xl font-semibold text-slate-100">
                            {lang === 'id'
                                ? 'AI sedang menyiapkan dokumen kamu'
                                : 'AI is preparing your documents'}
                        </h2>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {lang === 'id'
                            ? 'Kami sedang menyusun dokumen berdasarkan ide, stack, dan output yang kamu pilih.'
                            : 'We are generating documents based on your idea, stack, and selected outputs.'}
                    </p>
                    {progressSelectedFiles.length >= 5 && (
                        <p className="text-xs text-slate-500 mt-1">
                            {lang === 'id'
                                ? 'Untuk Full Package, proses bisa lebih lama karena AI perlu membuat beberapa file Markdown sekaligus.'
                                : 'Full Package may take longer because the AI needs to prepare multiple Markdown files.'}
                        </p>
                    )}
                </div>

                {/* Error card */}
                {isError && (
                    <div className="mb-4 rounded-lg border border-red-700/50 bg-red-900/10 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-red-300">
                                    {t(lang, 'errors')}
                                </p>
                                <p className="text-sm text-slate-300 mt-1">
                                    {useGeneratorStore.getState().error || t(lang, 'errorContact')}
                                </p>
                                {useGeneratorStore.getState().errorDetails && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300">
                                            Technical details
                                        </summary>
                                        <pre className="mt-2 text-xs text-slate-400 bg-slate-900 rounded p-2 overflow-x-auto whitespace-pre-wrap">
                                            {useGeneratorStore.getState().errorDetails}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Active message */}
                <div className="mb-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-cyan-300 min-h-[1.5rem]">
                        {isGenerating && !isError && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                        )}
                        <span>
                            {isError
                                ? (lang === 'id'
                                    ? 'Proses gagal. Coba lagi atau kembali ke form.'
                                    : 'Process failed. Try again or go back to form.')
                                : activeProgressMessage || (lang === 'id'
                                    ? 'Memulai...'
                                    : 'Starting...')}
                        </span>
                    </div>
                </div>

                {/* Stage list */}
                <div className="space-y-1.5 mb-5">
                    {completedStages.map((stage) => (
                        <div
                            key={stage.id}
                            className="flex items-center gap-2.5 text-sm text-slate-500"
                        >
                            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span className="line-clamp-1">
                                {lang === 'id' ? stage.labelId : stage.labelEn}
                            </span>
                        </div>
                    ))}

                    {activeStage && (
                        <div className="flex items-center gap-2.5 text-sm text-cyan-300 font-medium">
                            <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0" />
                            <span className="line-clamp-1">
                                {lang === 'id' ? activeStage.labelId : activeStage.labelEn}
                            </span>
                        </div>
                    )}

                    {pendingStages.map((stage) => (
                        <div
                            key={stage.id}
                            className="flex items-center gap-2.5 text-sm text-slate-600"
                        >
                            <div className="h-4 w-4 rounded-full border border-slate-700 shrink-0" />
                            <span className="line-clamp-1">
                                {lang === 'id' ? stage.labelId : stage.labelEn}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-700/50 pt-4 space-y-3">
                    {/* Elapsed time */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                            {lang === 'id' ? `Berjalan selama ${elapsed}` : `Running for ${elapsed}`}
                        </span>
                    </div>

                    {/* Selected files */}
                    {progressSelectedFiles.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                            <FileText className="h-3 w-3 text-slate-600 shrink-0" />
                            {progressSelectedFiles.map((filename) => (
                                <span
                                    key={filename}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-slate-700/50 text-slate-400"
                                >
                                    {filename}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Cancel button */}
                    {canCancel && (
                        <div className="pt-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancelGeneration}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 gap-1.5"
                            >
                                <X className="h-3.5 w-3.5" />
                                {lang === 'id' ? 'Batalkan' : 'Cancel'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
