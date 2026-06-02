import { create } from 'zustand'
import type {
    AgentTarget,
    ModelOption,
    TechStackPreset,
    OutputDocument,
    CustomStack,
    AdvancedConstraints,
    Question,
    GeneratedFile,
    GenerationProgressEvent,
    GenerationProgressDetails,
} from '../types'
import type { GenerationStage as ProgressStage } from '../types'
import type { AnalysisResult } from '../lib/analyzers/ambiguityAnalyzer'
import { callAi } from '../lib/ai/aiClient'
import { AI_CONFIG } from '../lib/ai/aiConfig'
import { generateQuestions } from '../lib/ai/generateQuestions'
import { buildSystemPrompt } from '../lib/ai/generateSystemPrompt'
import { parseAiResponse } from '../lib/ai/parseAiResponse'
import {
    buildQueryStages,
    buildDirectStages,
    ACTIVE_MESSAGE_BY_EVENT,
} from '../lib/generators/generationProgressStages'
import type { Lang } from '../lib/i18n/translations'

// ── Legacy stage enum (keep for backward compat) ────────────────
export type LegacyStage = 'idle' | 'analyzing' | 'questioning' | 'generating' | 'done' | 'error'

// ── Store interface ──────────────────────────────────────────────
interface GeneratorState {
    // Raw input
    rawIdea: string

    // Selections
    agentTarget: AgentTarget
    preferredModel: ModelOption
    customModelName: string
    selectedOutputs: OutputDocument[]
    techStack: TechStackPreset
    customStack: CustomStack
    advancedConstraints: AdvancedConstraints

    // UI state
    showAdvancedConstraints: boolean
    isGenerating: boolean
    generationStage: LegacyStage

    // Analysis results (local analyzer — kept for backward compat)
    analysisResult: AnalysisResult | null

    // AI question flow
    aiQuestions: Question[]
    currentQuestionIndex: number
    questionAnswers: Record<string, string>

    // Generated output
    generatedFiles: GeneratedFile[]

    // AI flow tracking
    error: string | null
    errorDetails: string | null
    lang: Lang

    // ── Progress system (new) ──────────────────────────────────
    progressStages: ProgressStage[]
    currentProgressEvent: GenerationProgressEvent | null
    activeProgressMessage: string
    progressStartedAt: number | null
    progressSelectedFiles: string[]
    abortController: AbortController | null
    cancelledMessage: string | null

    // Actions
    setRawIdea: (idea: string) => void
    setAgentTarget: (target: AgentTarget) => void
    setPreferredModel: (model: ModelOption) => void
    setCustomModelName: (name: string) => void
    setSelectedOutputs: (outputs: OutputDocument[]) => void
    toggleOutput: (output: OutputDocument) => void
    setTechStack: (stack: TechStackPreset) => void
    setCustomStack: (stack: CustomStack) => void
    setAdvancedConstraints: (constraints: AdvancedConstraints) => void
    setShowAdvancedConstraints: (show: boolean) => void
    setIsGenerating: (val: boolean) => void
    setGenerationStage: (stage: LegacyStage) => void
    setAnalysisResult: (result: AnalysisResult | null) => void
    setGeneratedFiles: (files: GeneratedFile[]) => void
    setLang: (lang: Lang) => void

    // Question actions
    setQuestions: (questions: Question[]) => void
    setCurrentQuestionIndex: (index: number) => void
    setAnswer: (questionId: string, answer: string) => void
    setAnswers: (answers: Record<string, string>) => void
    answerQuestion: (id: string, answer: string) => void
    nextQuestion: () => void
    prevQuestion: () => void
    isLastQuestion: () => boolean
    hasMoreQuestions: () => boolean

    // Progress actions
    setGenerationProgress: (event: GenerationProgressEvent, details?: GenerationProgressDetails) => void
    initProgressStages: (isQueryFlow: boolean) => void
    cancelGeneration: () => void

    // AI flow
    startGeneration: () => Promise<void>
    continueGeneration: () => Promise<void>

    // Error
    clearError: () => void

    // Reset
    reset: () => void
}

const initialState = {
    rawIdea: '',
    agentTarget: 'generic' as AgentTarget,
    preferredModel: 'auto' as ModelOption,
    customModelName: '',
    selectedOutputs: [
        'AGENTS.md',
        'PLAN.md',
        'PRD.md',
        'README.md',
        'DEPLOYMENT.md',
        'TASKS.md',
        'UI_UX_SPEC.md',
        'TESTING_PLAN.md',
    ] as OutputDocument[],
    techStack: 'auto' as TechStackPreset,
    customStack: {} as CustomStack,
    advancedConstraints: {} as AdvancedConstraints,
    showAdvancedConstraints: false,
    isGenerating: false,
    generationStage: 'idle' as LegacyStage,
    analysisResult: null as AnalysisResult | null,
    aiQuestions: [] as Question[],
    currentQuestionIndex: 0,
    questionAnswers: {} as Record<string, string>,
    generatedFiles: [] as GeneratedFile[],
    error: null as string | null,
    errorDetails: null as string | null,
    lang: 'id' as Lang,
    // Progress init
    progressStages: [] as ProgressStage[],
    currentProgressEvent: null as GenerationProgressEvent | null,
    activeProgressMessage: '',
    progressStartedAt: null as number | null,
    progressSelectedFiles: [] as string[],
    abortController: null as AbortController | null,
    cancelledMessage: null as string | null,
}

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
    ...initialState,

    setRawIdea: (rawIdea) => set({ rawIdea }),
    setAgentTarget: (agentTarget) => set({ agentTarget }),
    setPreferredModel: (preferredModel) => set({ preferredModel }),
    setCustomModelName: (customModelName) => set({ customModelName }),
    setSelectedOutputs: (selectedOutputs) => set({ selectedOutputs }),

    toggleOutput: (output) =>
        set((state) => {
            if (state.selectedOutputs.includes(output)) {
                return {
                    selectedOutputs: state.selectedOutputs.filter((o) => o !== output),
                }
            }
            return { selectedOutputs: [...state.selectedOutputs, output] }
        }),

    setTechStack: (techStack) => set({ techStack }),
    setCustomStack: (customStack) => set({ customStack }),
    setAdvancedConstraints: (advancedConstraints) => set({ advancedConstraints }),
    setShowAdvancedConstraints: (showAdvancedConstraints) =>
        set({ showAdvancedConstraints }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setGenerationStage: (generationStage) => set({ generationStage }),
    setAnalysisResult: (analysisResult) => set({ analysisResult }),
    setGeneratedFiles: (generatedFiles) => set({ generatedFiles }),
    setLang: (lang) => set({ lang }),

    // ── Progress actions ──────────────────────────────────────

    initProgressStages: (isQueryFlow: boolean) => {
        const stages = isQueryFlow ? buildQueryStages() : buildDirectStages()
        set({
            progressStages: stages,
            currentProgressEvent: null,
            activeProgressMessage: '',
            progressStartedAt: Date.now(),
            progressSelectedFiles: get().selectedOutputs,
            cancelledMessage: null,
        })
    },

    setGenerationProgress: (event: GenerationProgressEvent, details?: GenerationProgressDetails) => {
        const state = get()
        const msg = ACTIVE_MESSAGE_BY_EVENT[event]
        const lang = state.lang

        set({
            currentProgressEvent: event,
            activeProgressMessage: msg ? (lang === 'id' ? msg.id : msg.en) : '',
            progressStages: state.progressStages.map((s) => {
                if (s.id === event) {
                    return { ...s, status: 'active' as const, startedAt: Date.now() }
                }
                // Mark previous active stages as completed if this event is different
                if (s.status === 'active' && s.id !== event) {
                    return { ...s, status: 'completed' as const, completedAt: Date.now() }
                }
                return s
            }),
            // If details contain selectedFiles, update them
            ...(details?.selectedFiles ? { progressSelectedFiles: details.selectedFiles } : {}),
        })
    },

    cancelGeneration: () => {
        const state = get()
        const { abortController } = state

        if (abortController) {
            abortController.abort()
        }

        set({
            isGenerating: false,
            generationStage: 'idle',
            error: null,
            errorDetails: null,
            cancelledMessage: state.lang === 'id'
                ? 'Proses dibatalkan. Input kamu tetap aman.'
                : 'Generation cancelled. Your input is safe.',
            progressStages: [],
            currentProgressEvent: null,
            activeProgressMessage: '',
            progressStartedAt: null,
            abortController: null,
        })
    },

    // ── Question actions ───────────────────────────────────────

    setQuestions: (aiQuestions) => set({ aiQuestions, currentQuestionIndex: 0 }),
    setCurrentQuestionIndex: (currentQuestionIndex) =>
        set({ currentQuestionIndex }),
    setAnswer: (questionId, answer) =>
        set((state) => ({
            questionAnswers: { ...state.questionAnswers, [questionId]: answer },
        })),
    setAnswers: (questionAnswers) => set({ questionAnswers }),
    answerQuestion: (id, answer) =>
        set((state) => ({
            questionAnswers: { ...state.questionAnswers, [id]: answer },
        })),

    nextQuestion: () => {
        const { currentQuestionIndex, aiQuestions } = get()
        if (currentQuestionIndex < aiQuestions.length - 1) {
            set({ currentQuestionIndex: currentQuestionIndex + 1 })
        }
    },

    prevQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
            set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
    },

    isLastQuestion: () => {
        const { currentQuestionIndex, aiQuestions } = get()
        return currentQuestionIndex >= aiQuestions.length - 1
    },

    hasMoreQuestions: () => {
        const { currentQuestionIndex, aiQuestions } = get()
        return currentQuestionIndex < aiQuestions.length - 1
    },

    clearError: () => set({
        error: null,
        errorDetails: null,
        generationStage: 'idle',
        progressStages: [],
        currentProgressEvent: null,
        activeProgressMessage: '',
        progressStartedAt: null,
        cancelledMessage: null,
    }),

    // ── AI Flow ────────────────────────────────────────────────

    startGeneration: async () => {
        const state = get()
        if (!state.rawIdea.trim()) return

        // Check API key early
        if (!AI_CONFIG.apiKey) {
            set({
                generationStage: 'error',
                error: state.lang === 'id'
                    ? 'Kunci API AI belum diset'
                    : 'AI API key not set',
                errorDetails: 'Set VITE_OPENAI_API_KEY in .env file',
                isGenerating: false,
            })
            return
        }

        // Create abort controller for this generation
        const abortController = new AbortController()

        set({
            generationStage: 'analyzing',
            error: null,
            errorDetails: null,
            isGenerating: true,
            aiQuestions: [],
            currentQuestionIndex: 0,
            questionAnswers: {},
            generatedFiles: [],
            cancelledMessage: null,
            abortController,
        })

        // Init progress — we start with the query flow (will adjust if no questions needed)
        get().initProgressStages(true)
        get().setGenerationProgress('prepare-context')

        try {
            // Step 1: check ambiguity
            get().setGenerationProgress('check-ambiguity')

            // Step 2: Ask AI for clarifying questions
            get().setGenerationProgress('request-question-generation')
            get().setGenerationProgress('waiting-question-response')

            const questions = await generateQuestions(
                state.rawIdea,
                state.lang,
                abortController.signal,
            )

            if (abortController.signal.aborted) {
                // cancelGeneration already handled state
                return
            }

            if (questions.length > 0) {
                // Step 3: Parse and enter questioning flow
                get().setGenerationProgress('parse-question-response')
                get().setGenerationProgress('prepare-question-flow')

                set({
                    aiQuestions: questions,
                    currentQuestionIndex: 0,
                    questionAnswers: {},
                    generationStage: 'questioning',
                    isGenerating: false,
                    abortController: null,
                    progressStages: [],
                    currentProgressEvent: null,
                    activeProgressMessage: '',
                    progressStartedAt: null,
                })
                return
            }

            // No questions needed — generate directly
            // Re-init progress for direct generation
            // Then re-emit completed leading stages so step list shows them done
            get().initProgressStages(false)
            get().setGenerationProgress('prepare-context')
            get().setGenerationProgress('check-ambiguity')
            await get().continueGeneration()
        } catch (err) {
            if (abortController.signal.aborted) return // already handled

            const msg = err instanceof Error ? err.message : String(err)
            set({
                generationStage: 'error',
                error: state.lang === 'id'
                    ? 'Gagal menghubungi AI'
                    : 'Failed to contact AI',
                errorDetails: msg,
                isGenerating: false,
                abortController: null,
                progressStages: get().progressStages.map((s) =>
                    s.status === 'active'
                        ? { ...s, status: 'error' as const }
                        : s,
                ),
                currentProgressEvent: 'error',
                activeProgressMessage: state.lang === 'id'
                    ? 'Terjadi kesalahan saat menghubungi AI.'
                    : 'An error occurred contacting AI.',
            })
        }
    },

    continueGeneration: async () => {
        const state = get()

        const abortController = new AbortController()

        set({
            generationStage: 'generating',
            error: null,
            errorDetails: null,
            isGenerating: true,
            abortController,
        })

        // Init stages for direct doc generation if not already set
        if (get().progressStages.length === 0) {
            get().initProgressStages(false)
            // When called fresh (e.g. from QuestionFlow → Generate Docs),
            // emit the leading stages
            get().setGenerationProgress('merge-answers')
        }

        get().setGenerationProgress('request-document-generation')

        try {
            // Build system prompt with all context
            const constraints: Record<string, string> = {}
            const ac = state.advancedConstraints
            if (ac.projectName) constraints.projectName = ac.projectName
            if (ac.targetUsers) constraints.targetUsers = ac.targetUsers
            if (ac.deploymentTarget) constraints.deploymentTarget = ac.deploymentTarget
            if (ac.budgetConstraint) constraints.budgetConstraint = ac.budgetConstraint
            if (ac.mustHaveFeatures) constraints.mustHaveFeatures = ac.mustHaveFeatures
            if (ac.mustNotUse) constraints.mustNotUse = ac.mustNotUse
            if (ac.languagePreference) constraints.languagePreference = ac.languagePreference
            if (ac.conventionPreference) constraints.conventionPreference = ac.conventionPreference
            if (ac.deadlinePreference) constraints.deadlinePreference = ac.deadlinePreference

            const systemPrompt = buildSystemPrompt({
                selectedOutputs: state.selectedOutputs,
                agentTarget: state.agentTarget,
                model: state.preferredModel === 'custom' && state.customModelName
                    ? state.customModelName
                    : state.preferredModel,
                techStack: state.techStack,
                advancedConstraints: constraints,
                lang: state.lang,
                answers: state.questionAnswers,
            })

            // Call AI
            get().setGenerationProgress('waiting-document-response')

            const raw = await callAi([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: state.rawIdea },
            ], { temperature: 0.4, signal: abortController.signal })

            if (abortController.signal.aborted) return

            // Parse
            get().setGenerationProgress('parse-ai-response')
            const parsed = parseAiResponse(raw)

            if (parsed.usedFallback) {
                get().setGenerationProgress('fallback-parse-response')
            }

            // Prepare preview
            get().setGenerationProgress('prepare-preview')

            const files: GeneratedFile[] = parsed.files.map((f) => ({
                filename: f.filename,
                content: f.content,
                language: 'markdown' as const,
            }))

            // Mark done
            get().setGenerationProgress('done')

            set({
                generatedFiles: files,
                generationStage: 'done',
                isGenerating: false,
                abortController: null,
                progressStages: [],
                currentProgressEvent: null,
                activeProgressMessage: '',
                progressStartedAt: null,
            })
        } catch (err) {
            if (abortController.signal.aborted) return

            const msg = err instanceof Error ? err.message : String(err)
            const currentStages = get().progressStages
            set({
                generationStage: 'error',
                error: state.lang === 'id'
                    ? 'Gagal menghasilkan dokumen'
                    : 'Failed to generate documents',
                errorDetails: msg,
                isGenerating: false,
                abortController: null,
                progressStages: currentStages.map((s) =>
                    s.status === 'active'
                        ? { ...s, status: 'error' as const }
                        : s,
                ),
                currentProgressEvent: 'error',
                activeProgressMessage: state.lang === 'id'
                    ? 'Terjadi kesalahan saat menghasilkan dokumen.'
                    : 'An error occurred generating documents.',
            })
        }
    },

    reset: () => set(initialState),
}))
