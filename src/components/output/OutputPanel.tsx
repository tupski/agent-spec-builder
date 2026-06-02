import { useState, useMemo } from 'react'
import { RefreshCw, FileText } from 'lucide-react'
import { useGeneratorStore } from '../../stores/generatorStore'
import { OutputTabs } from './OutputTabs'
import { MermaidPreview } from './MermaidPreview'
import { EditableMarkdown } from './EditableMarkdown'
import { ExportActions } from './ExportActions'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

export function OutputPanel() {
    const generatedFiles = useGeneratorStore((s) => s.generatedFiles)
    const setGeneratedFiles = useGeneratorStore((s) => s.setGeneratedFiles)
    const setGenerationPhase = useGeneratorStore((s) => s.setGenerationPhase)

    const [activeTab, setActiveTab] = useState<string>('')

    // Set initial active tab when files change
    useMemo(() => {
        if (generatedFiles.length > 0 && !activeTab) {
            setActiveTab(generatedFiles[0].filename)
        }
    }, [generatedFiles, activeTab])

    const currentFile = generatedFiles.find((f) => f.filename === activeTab) ?? null

    const handleContentChange = (newContent: string) => {
        if (!currentFile) return
        setGeneratedFiles(
            generatedFiles.map((f) =>
                f.filename === currentFile.filename
                    ? { ...f, content: newContent }
                    : f
            )
        )
    }

    const handleRegenerate = () => {
        setGeneratedFiles([])
        setGenerationPhase('idle')
    }

    if (generatedFiles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-slate-600 mb-4" />
                <p className="text-slate-400">No documents generated yet</p>
                <p className="text-sm text-slate-600 mt-1">
                    Enter your idea and click Generate to create documents
                </p>
            </div>
        )
    }

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

    // Get project name for ZIP
    const projectName = useGeneratorStore((s) =>
        s.advancedConstraints?.projectName || s.answers['project_name'] || 'project'
    )

    return (
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
            {/* Actions bar */}
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-slate-400">Generated Documents</h2>
                <div className="flex items-center gap-2">
                    <ExportActions
                        currentFile={currentFile}
                        allFiles={generatedFiles}
                        projectName={projectName}
                    />
                    <Button variant="ghost" size="sm" onClick={handleRegenerate}>
                        <RefreshCw className="h-4 w-4" />
                        New Spec
                    </Button>
                </div>
            </div>

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
                            <h3 className="text-sm font-medium text-slate-400">Diagrams</h3>
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
