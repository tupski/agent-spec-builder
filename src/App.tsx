import { useState, useEffect, useCallback } from 'react'
import { AppShell } from './components/layout/AppShell'
import { ChatComposer } from './components/composer/ChatComposer'
import { DraftDrawer } from './components/drafts/DraftDrawer'
import { ImportBackupDialog } from './components/drafts/ImportBackupDialog'
import { downloadBackup } from './lib/storage/exportBackup'
import { saveProject } from './lib/storage/projectRepository'
import { useGeneratorStore } from './stores/generatorStore'
import { generateId } from './lib/utils/ids'
import type { ProjectRecord } from './lib/storage/db'

export default function App() {
  const reset = useGeneratorStore((s) => s.reset)
  const rawIdea = useGeneratorStore((s) => s.rawIdea)
  const agentTarget = useGeneratorStore((s) => s.agentTarget)
  const preferredModel = useGeneratorStore((s) => s.preferredModel)
  const selectedOutputs = useGeneratorStore((s) => s.selectedOutputs)
  const techStack = useGeneratorStore((s) => s.techStack)
  const customStack = useGeneratorStore((s) => s.customStack)
  const advancedConstraints = useGeneratorStore((s) => s.advancedConstraints)
  const questions = useGeneratorStore((s) => s.questions)
  const answers = useGeneratorStore((s) => s.answers)
  const generatedFiles = useGeneratorStore((s) => s.generatedFiles)
  const generationPhase = useGeneratorStore((s) => s.generationPhase)
  const setRawIdea = useGeneratorStore((s) => s.setRawIdea)
  const setAgentTarget = useGeneratorStore((s) => s.setAgentTarget)
  const setPreferredModel = useGeneratorStore((s) => s.setPreferredModel)
  const setSelectedOutputs = useGeneratorStore((s) => s.setSelectedOutputs)
  const setTechStack = useGeneratorStore((s) => s.setTechStack)
  const setCustomStack = useGeneratorStore((s) => s.setCustomStack)
  const setAdvancedConstraints = useGeneratorStore((s) => s.setAdvancedConstraints)
  const setQuestions = useGeneratorStore((s) => s.setQuestions)
  const setAnswers = useGeneratorStore((s) => s.setAnswers)
  const setGeneratedFiles = useGeneratorStore((s) => s.setGeneratedFiles)
  const setGenerationPhase = useGeneratorStore((s) => s.setGenerationPhase)

  const [draftsOpen, setDraftsOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  // Auto-save draft when generation completes
  useEffect(() => {
    if (generationPhase !== 'done' || generatedFiles.length === 0) return

    const autoSave = async () => {
      const projectName = advancedConstraints?.projectName || answers['project_name'] || 'Untitled'

      const draft = {
        id: generateId(),
        title: projectName,
        rawIdea,
        agentTarget,
        preferredModel,
        selectedOutputs,
        techStack,
        customStack,
        advancedConstraints,
        questions,
        answers,
        generatedFiles,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      }

      try {
        await saveProject(draft)
        console.log('Draft auto-saved:', draft.id)
      } catch (err) {
        console.error('Failed to auto-save draft:', err)
      }
    }

    autoSave()
  }, [generationPhase, generatedFiles])

  const handleNewSpec = () => {
    reset()
  }

  const handleDrafts = () => {
    setDraftsOpen(true)
  }

  const handleImport = () => {
    setImportOpen(true)
  }

  const handleExport = () => {
    downloadBackup()
  }

  const handleSelectDraft = useCallback((draft: ProjectRecord) => {
    reset()

    // Restore all state from draft
    setRawIdea(draft.rawIdea)
    setAgentTarget(draft.agentTarget as any)
    setPreferredModel(draft.preferredModel as any)
    setSelectedOutputs(draft.selectedOutputs as any)
    setTechStack(draft.techStack as any)
    if (draft.customStack) setCustomStack(draft.customStack)
    if (draft.advancedConstraints) setAdvancedConstraints(draft.advancedConstraints)
    if (draft.questions) setQuestions(draft.questions)
    if (draft.answers) {
      setAnswers(draft.answers)
    }
    if (draft.generatedFiles) {
      setGeneratedFiles(draft.generatedFiles)
      setGenerationPhase('done')
    }
  }, [reset, setRawIdea, setAgentTarget, setPreferredModel, setSelectedOutputs, setTechStack, setCustomStack, setAdvancedConstraints, setQuestions, setAnswers, setGeneratedFiles, setGenerationPhase])

  return (
    <>
      <AppShell
        onNewSpec={handleNewSpec}
        onDrafts={handleDrafts}
        onImport={handleImport}
        onExport={handleExport}
      >
        <ChatComposer />
      </AppShell>

      <DraftDrawer
        open={draftsOpen}
        onOpenChange={setDraftsOpen}
        onSelect={handleSelectDraft}
      />

      <ImportBackupDialog
        open={importOpen}
        onOpenChange={setImportOpen}
      />
    </>
  )
}
