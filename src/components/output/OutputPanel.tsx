import { useState, useMemo, useEffect } from 'react'
import {
    RefreshCw,
    FileText,
    AlertTriangle,
} from 'lucide-react'
import { useGeneratorStore } from '../../stores/generatorStore'
import { OutputTabs } from './OutputTabs'
import { MermaidPreview } from './MermaidPreview'
import { EditableMarkdown } from './EditableMarkdown'
import { ExportActions } from './ExportActions'
import { QuestionFlow } from '../questions/QuestionFlow'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { GenerationProgress } from '../generation/GenerationProgress'
import { t, type Lang } from '../../lib/i18n/translations'

type Props = {
    lang: Lang
}

export function OutputPanel({ lang }: Props) {
    const generatedFiles = useGeneratorStore((s) => s.generatedFiles)
    const setGeneratedFiles = useGeneratorStore((s) => s.setGeneratedFiles)
    const generationStage = useGeneratorStore((s) => s.generationStage)
    const error = useGeneratorStore((s) => s.error)
    const errorDetails = useGeneratorStore((s) => s.errorDetails)
    const clearError = useGeneratorStore((s) => s.clearError)
    const startGeneration = useGeneratorStore((s) => s.startGeneration)
    const reset = useGeneratorStore((s) => s.reset)

    const [activeTab, setActiveTab] = useState<string>('')

    // Set initial active tab when files change
    useEffect(() => {
        if (generatedFiles.length > 0 && !activeTab) {
            setActiveTab(generatedFiles[0].filename)
        }
    }, [generatedFiles, activeTab])

    const currentFile = generatedFiles.find((f) => f.filename === activeTab) ?? null

    // Extract summary + assumptions from first file's frontmatter or top section
    // (in future could store these in store; for now rely on file content)
    const hasSummary = generatedFiles.length > 0

    const handleContentChange = (newContent: string) => {
        if (!currentFile) return
        setGeneratedFiles(
            generatedFiles.map((f) =>
                f.filename === currentFile.filename
                    ? { ...f, content: newContent }
                    : f,
            ),
        )
    }

    const handleBackToForm = () => {
        clearError()
    }

    const handleRetry = () => {
        clearError()
        startGeneration()
    }

    // ── Stage: generating ─────────────────────────────────────────
    if (generationStage === 'generating') {
        return <GenerationProgress lang={lang} />
    }

    // ── Stage: questioning ────────────────────────────────────────
    if (generationStage === 'questioning') {
        return <QuestionFlow lang={lang} />
    }
    // ── Stage: analyzing (legacy fallback) ─────────────────────────
    if (generationStage === 'analyzing') {
        return <GenerationProgress lang={lang} />
    }

    // ── Stage: error ──────────────────────────────────────────────
    if (generationStage === 'error') {
        return (
            <div className="mx-auto max-w-2xl px-4 py-10">
                <Card className="border-red-700/50 bg-red-900/10 p-6 text-center">
                    <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-red-300 mb-2">
                        {t(lang, 'errors')}
                    </h3>
                    <p className="text-sm text-slate-300 mb-1">
                        {error || t(lang, 'errorContact')}
                    </p>
                    {errorDetails && (
                        <details className="mt-2 text-left">
                            <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300">
                                Technical details
                            </summary>
                            <pre className="mt-2 text-xs text-slate-400 bg-slate-900 rounded p-2 overflow-x-auto whitespace-pre-wrap">
                                {errorDetails}
                            </pre>
                        </details>
                    )}
                    <div className="flex items-center justify-center gap-3 mt-6">
                        <Button variant="default" size="sm" onClick={handleRetry}>
                            <RefreshCw className="h-4 w-4" />
                            {t(lang, 'errorRetry')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleBackToForm}>
                            {lang === 'id' ? 'Kembali ke Form' : 'Back to Form'}
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    // ── Stage: idle (no documents) ────────────────────────────────
    if (generatedFiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-slate-600 mb-4" />
                <p className="text-slate-400">{t(lang, 'welcomeTitle')}</p>
                <p className="text-sm text-slate-600 mt-1">
                    {t(lang, 'welcomeDesc')}
                </p>
            </div>
        )
    }

    // ── Stage: done (files present) ───────────────────────────────

    // Extract Mermaid content from current file
    const mermaidBlocks = useMemo(() => {
        if (!currentFile) return []
        const regex = /```mermaid\n([\s\S]*?)```/g
        const blocks: string[] = []
        let match
        while ((match = regex.exec(currentFile.content)) !== null) {
            blocks.push(match[1].trim())
        }
        return blocks
    }, [currentFile])

    // Get project name
    const projectName = useGeneratorStore(
        (s) => s.advancedConstraints?.projectName || 'project',
    )

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
            {/* Actions bar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-sm font-medium text-slate-400">
                    {t(lang, 'summary')}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <ExportActions
                        currentFile={currentFile}
                        allFiles={generatedFiles}
                        projectName={projectName}
                    />
                    <Button variant="ghost" size="sm" onClick={reset}>
                        <RefreshCw className="h-4 w-4" />
                        {t(lang, 'newSpec')}
                    </Button>
                </div>
            </div>

            {/* Summary + Assumptions — extracted from first file content */}
            {hasSummary && generatedFiles[0] && (
                <Card className="p-4 space-y-2">
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {generatedFiles[0].content
                            .split('\n')
                            .slice(0, 5)
                            .filter((l) => l.trim() && !l.startsWith('#'))
                            .join(' ')
                            .slice(0, 300)}
                    </p>
                </Card>
            )}

            {/* Tabs */}
            <OutputTabs
                files={generatedFiles}
                activeFile={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Content */}
            {currentFile && (
                <div className="space-y-4">
                    {/* Mermaid diagrams (if any in this file) */}
                    {mermaidBlocks.length > 0 && (
                        <Card className="space-y-4">
                            <h3 className="text-sm font-medium text-slate-400">
                                {t(lang, 'diagrams')}
                            </h3>
                            {mermaidBlocks.map((block, i) => (
                                <MermaidPreview key={i} content={block} />
                            ))}
                        </Card>
                    )}

                    {/* Markdown preview / editor */}
                    <EditableMarkdown
                        content={currentFile.content}
                        onChange={handleContentChange}
                    />
                </div>
            )}
        </div>
    )
}

export default OutputPanel
