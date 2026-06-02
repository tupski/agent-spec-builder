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
} from '../types'
import type { AnalysisResult } from '../lib/analyzers/ambiguityAnalyzer'
import { callAi } from '../lib/ai/aiClient'
import { AI_CONFIG } from '../lib/ai/aiConfig'
import { generateQuestions } from '../lib/ai/generateQuestions'
import { buildSystemPrompt } from '../lib/ai/generateSystemPrompt'
import { parseAiResponse } from '../lib/ai/parseAiResponse'
import type { Lang } from '../lib/i18n/translations'

export type GenerationStage = 'idle' | 'analyzing' | 'questioning' | 'generating' | 'done' | 'error'

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
    generationStage: GenerationStage

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
    setGenerationStage: (stage: GenerationStage) => void
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
    generationStage: 'idle' as GenerationStage,
    analysisResult: null as AnalysisResult | null,
    aiQuestions: [] as Question[],
    currentQuestionIndex: 0,
    questionAnswers: {} as Record<string, string>,
    generatedFiles: [] as GeneratedFile[],
    error: null as string | null,
    errorDetails: null as string | null,
    lang: 'id' as Lang,
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

    // Question actions — keep backward compat with draft restore
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

    clearError: () => set({ error: null, errorDetails: null, generationStage: 'idle' }),

    // ─── AI Flow ────────────────────────────────────────────────

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

        set({
            generationStage: 'analyzing',
            error: null,
            errorDetails: null,
            isGenerating: true,
            aiQuestions: [],
            currentQuestionIndex: 0,
            questionAnswers: {},
            generatedFiles: [],
        })

        try {
            // Step 1: Ask AI for clarifying questions
            const questions = await generateQuestions(state.rawIdea, state.lang)

            if (questions.length > 0) {
                // Step 2: Enter questioning flow
                set({
                    aiQuestions: questions,
                    currentQuestionIndex: 0,
                    questionAnswers: {},
                    generationStage: 'questioning',
                    isGenerating: false,
                })
                return
            }

            // Step 3: No questions needed — generate directly
            await get().continueGeneration()
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            set({
                generationStage: 'error',
                error: state.lang === 'id'
                    ? 'Gagal menghubungi AI'
                    : 'Failed to contact AI',
                errorDetails: msg,
                isGenerating: false,
            })
        }
    },

    continueGeneration: async () => {
        const state = get()

        set({
            generationStage: 'generating',
            error: null,
            errorDetails: null,
            isGenerating: true,
        })

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

            const raw = await callAi([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: state.rawIdea },
            ], { temperature: 0.4 })

            const parsed = parseAiResponse(raw)

            const files: GeneratedFile[] = parsed.files.map((f) => ({
                filename: f.filename,
                content: f.content,
                language: 'markdown' as const,
            }))

            set({
                generatedFiles: files,
                generationStage: 'done',
                isGenerating: false,
            })
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            set({
                generationStage: 'error',
                error: state.lang === 'id'
                    ? 'Gagal menghasilkan dokumen'
                    : 'Failed to generate documents',
                errorDetails: msg,
                isGenerating: false,
            })
        }
    },

    reset: () => set(initialState),
}))
