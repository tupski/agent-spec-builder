import { useCallback, useEffect } from 'react'
import { Send } from 'lucide-react'
import { AutoGrowTextarea } from './AutoGrowTextarea'
import { ComposerTools } from './ComposerTools'
import { Button } from '../ui/Button'
import { QuestionFlow } from '../questions/QuestionFlow'
import { OutputPanel } from '../output/OutputPanel'
import { useGeneratorStore } from '../../stores/generatorStore'
import { extractRequirements } from '../../lib/analyzers/requirementExtractor'
import { analyzeAmbiguity } from '../../lib/analyzers/ambiguityAnalyzer'
import { generateDocuments } from '../../lib/generators/documentGenerator'

export function ChatComposer() {
    const rawIdea = useGeneratorStore((s) => s.rawIdea)
    const setRawIdea = useGeneratorStore((s) => s.setRawIdea)
    const isGenerating = useGeneratorStore((s) => s.isGenerating)
    const generationPhase = useGeneratorStore((s) => s.generationPhase)
    const agentTarget = useGeneratorStore((s) => s.agentTarget)
    const preferredModel = useGeneratorStore((s) => s.preferredModel)
    const selectedOutputs = useGeneratorStore((s) => s.selectedOutputs)
    const techStack = useGeneratorStore((s) => s.techStack)
    const advancedConstraints = useGeneratorStore((s) => s.advancedConstraints)
    const questions = useGeneratorStore((s) => s.questions)
    const answers = useGeneratorStore((s) => s.answers)
    const generatedFiles = useGeneratorStore((s) => s.generatedFiles)
    const customModelName = useGeneratorStore((s) => s.customModelName)
    const customStack = useGeneratorStore((s) => s.customStack)
    const setGenerationPhase = useGeneratorStore((s) => s.setGenerationPhase)
    const setAnalysisResult = useGeneratorStore((s) => s.setAnalysisResult)
    const setQuestions = useGeneratorStore((s) => s.setQuestions)
    const setGeneratedFiles = useGeneratorStore((s) => s.setGeneratedFiles)

    // Auto-generate when phase transitions to 'generating'
    useEffect(() => {
        if (generationPhase === 'generating' && generatedFiles.length === 0) {
            const files = generateDocuments({
                rawIdea,
                agentTarget,
                preferredModel,
                customModelName,
                selectedOutputs,
                techStack,
                customStack: customStack as Record<string, string>,
                advancedConstraints,
                questions,
                answers,
            })
            setGeneratedFiles(files)
            setGenerationPhase('done')
        }
    }, [
        generationPhase,
        rawIdea,
        agentTarget,
        preferredModel,
        customModelName,
        selectedOutputs,
        techStack,
        customStack,
        advancedConstraints,
        questions,
        answers,
        setGeneratedFiles,
        setGenerationPhase,
        generatedFiles.length,
    ])

    const handleGenerate = useCallback(() => {
        if (!rawIdea.trim() || isGenerating) return

        setGenerationPhase('analyzing')

        const extracted = extractRequirements(rawIdea, advancedConstraints)
        const result = analyzeAmbiguity(
            rawIdea,
            extracted,
            agentTarget,
            selectedOutputs,
            techStack,
            advancedConstraints,
        )

        setAnalysisResult(result)

        if (result.isClearEnough) {
            setGenerationPhase('generating')
        } else {
            setQuestions(result.suggestedQuestions)
            setGenerationPhase('questioning')
        }
    }, [
        rawIdea,
        isGenerating,
        agentTarget,
        selectedOutputs,
        techStack,
        advancedConstraints,
        setGenerationPhase,
        setAnalysisResult,
        setQuestions,
    ])

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault()
                handleGenerate()
            }
        },
        [handleGenerate],
    )

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            {generationPhase === 'idle' || generationPhase === 'analyzing' ? (
                <div className="flex flex-col gap-4">
                    <AutoGrowTextarea
                        value={rawIdea}
                        onChange={(e) => setRawIdea(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tulis ide kasar project kamu di sini... contoh: Saya mau bikin aplikasi kasir sederhana untuk warung kecil..."
                    />
                    <ComposerTools />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleGenerate}
                            disabled={!rawIdea.trim() || isGenerating}
                            size="lg"
                            className="gap-2"
                        >
                            <Send className="h-4 w-4" />
                            {isGenerating ? 'Processing...' : 'Generate'}
                        </Button>
                    </div>
                    <p className="text-center text-xs text-slate-600">
                        Ctrl/Cmd + Enter untuk generate
                    </p>
                </div>
            ) : generationPhase === 'questioning' ? (
                <QuestionFlow />
            ) : generationPhase === 'generating' ? (
                <div className="text-center py-16">
                    <p className="text-slate-400">Generating documents...</p>
                </div>
            ) : generationPhase === 'done' ? (
                <OutputPanel />
            ) : null}
        </div>
    )
}
