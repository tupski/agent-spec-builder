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
    generationPhase: 'idle' | 'analyzing' | 'questioning' | 'generating' | 'done'

    // Analysis results
    analysisResult: AnalysisResult | null

    // Question queue
    questions: Question[]
    currentQuestionIndex: number
    answers: Record<string, string>

    // Generated output
    generatedFiles: GeneratedFile[]

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
    setGenerationPhase: (phase: 'idle' | 'analyzing' | 'questioning' | 'generating' | 'done') => void
    setAnalysisResult: (result: AnalysisResult | null) => void

    // Question actions
    setQuestions: (questions: Question[]) => void
    setCurrentQuestionIndex: (index: number) => void
    setAnswer: (questionId: string, answer: string) => void
    goToNextQuestion: () => void
    goToPrevQuestion: () => void
    isLastQuestion: () => boolean
    hasMoreQuestions: () => boolean

    // Generated files actions
    setGeneratedFiles: (generatedFiles: GeneratedFile[]) => void

    // Reset
    reset: () => void
}

const initialState = {
    rawIdea: '',
    agentTarget: 'roo-code' as AgentTarget,
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
    generationPhase: 'idle' as const,
    analysisResult: null as AnalysisResult | null,
    questions: [] as Question[],
    currentQuestionIndex: 0,
    answers: {} as Record<string, string>,
    generatedFiles: [] as GeneratedFile[],
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
    setGenerationPhase: (generationPhase) => set({ generationPhase }),
    setAnalysisResult: (analysisResult) => set({ analysisResult }),

    setQuestions: (questions) => set({ questions, currentQuestionIndex: 0 }),
    setCurrentQuestionIndex: (currentQuestionIndex) =>
        set({ currentQuestionIndex }),
    setAnswer: (questionId, answer) =>
        set((state) => ({
            answers: { ...state.answers, [questionId]: answer },
        })),

    goToNextQuestion: () => {
        const { currentQuestionIndex, questions } = get()
        if (currentQuestionIndex < questions.length - 1) {
            set({ currentQuestionIndex: currentQuestionIndex + 1 })
        }
    },

    goToPrevQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
            set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
    },

    isLastQuestion: () => {
        const { currentQuestionIndex, questions } = get()
        return currentQuestionIndex >= questions.length - 1
    },

    hasMoreQuestions: () => {
        const { currentQuestionIndex, questions } = get()
        return currentQuestionIndex < questions.length - 1
    },

    setGeneratedFiles: (generatedFiles) => set({ generatedFiles }),

    reset: () => set(initialState),
}))
