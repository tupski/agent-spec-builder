import { useCallback, lazy, Suspense } from 'react'
import { GenerationProgress } from '../generation/GenerationProgress'
import { Send } from 'lucide-react'
import { AutoGrowTextarea } from './AutoGrowTextarea'
import { ComposerTools } from './ComposerTools'
import { ExamplePrompts } from './ExamplePrompts'
import { Button } from '../ui/Button'
import { useGeneratorStore } from '../../stores/generatorStore'
import { AI_CONFIG } from '../../lib/ai/aiConfig'
import { t, type Lang } from '../../lib/i18n/translations'

const OutputPanel = lazy(() => import('../output/OutputPanel'))

type Props = {
    lang: Lang
}

export function ChatComposer({ lang }: Props) {
    const rawIdea = useGeneratorStore((s) => s.rawIdea)
    const setRawIdea = useGeneratorStore((s) => s.setRawIdea)
    const generationStage = useGeneratorStore((s) => s.generationStage)
    const isGenerating = useGeneratorStore((s) => s.isGenerating)
    const startGeneration = useGeneratorStore((s) => s.startGeneration)

    const hasApiKey = !!AI_CONFIG.apiKey

    const handleGenerate = useCallback(() => {
        if (!rawIdea.trim() || isGenerating) return
        startGeneration()
    }, [rawIdea, isGenerating, startGeneration])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                handleGenerate()
            }
        },
        [handleGenerate],
    )

    const handleExampleSelect = useCallback(
        (prompt: string) => {
            setRawIdea(prompt)
        },
        [setRawIdea],
    )

    // Show composer when idle (before generation or after cancel)
    const showComposer =
        generationStage === 'idle' ||
        generationStage === 'analyzing'

    // Show progress while generating (analyzing stage with progress system active)
    const showProgress =
        generationStage === 'analyzing' && isGenerating

    // Show output panel when done, error, or questioning
    const showOutput =
        generationStage === 'generating' ||
        generationStage === 'done' ||
        generationStage === 'error' ||
        generationStage === 'questioning'

    const cancelledMessage = useGeneratorStore((s) => s.cancelledMessage)

    // When cancelled message is shown and user starts typing, clear it
    const handleIdeaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRawIdea(e.target.value)
        if (cancelledMessage) {
            useGeneratorStore.setState({ cancelledMessage: null })
        }
    }, [setRawIdea, cancelledMessage])

    return (
        <div className="mx-auto max-w-3xl px-4 py-6 md:py-8">
            {showComposer && !isGenerating && (
                <div className="flex flex-col gap-4">
                    {/* Cancelled banner */}
                    {cancelledMessage && (
                        <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-4 py-3 text-sm text-slate-300">
                            {cancelledMessage}
                        </div>
                    )}

                    <AutoGrowTextarea
                        value={rawIdea}
                        onChange={handleIdeaChange}
                        onKeyDown={handleKeyDown}
                        onGenerate={handleGenerate}
                        placeholder={t(lang, 'placeholderIdea')}
                    />
                    <ExamplePrompts onSelect={handleExampleSelect} lang={lang} />
                    <ComposerTools lang={lang} />

                    {/* AI Status indicator */}
                    <div className="flex items-center justify-center gap-2">
                        <span
                            className={`inline-block h-2 w-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-yellow-500'
                                }`}
                        />
                        <span className="text-xs text-slate-500">
                            {hasApiKey ? t(lang, 'aiConnected') : t(lang, 'aiKeyNotSet')}
                        </span>
                    </div>

                    <div className="flex justify-end px-1 md:px-0">
                        <Button
                            onClick={handleGenerate}
                            disabled={!rawIdea.trim() || isGenerating}
                            size="lg"
                            className="gap-2"
                        >
                            <Send className="h-4 w-4" />
                            {isGenerating ? t(lang, 'generating') : t(lang, 'generate')}
                        </Button>
                    </div>
                    <p className="text-center text-xs text-slate-600">
                        {t(lang, 'ctrlEnter')}
                    </p>
                </div>
            )}

            {showProgress && (
                <GenerationProgress lang={lang} />
            )}

            {showOutput && (
                <Suspense fallback={
                    <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
                        Loading...
                    </div>
                }>
                    <OutputPanel lang={lang} />
                </Suspense>
            )}
        </div>
    )
}
