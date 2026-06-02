export type GenerationStageStatus = 'pending' | 'active' | 'completed' | 'error'

export type GenerationProgressEvent =
    | 'prepare-context'
    | 'check-ambiguity'
    | 'request-question-generation'
    | 'waiting-question-response'
    | 'parse-question-response'
    | 'prepare-question-flow'
    | 'merge-answers'
    | 'request-document-generation'
    | 'waiting-document-response'
    | 'parse-ai-response'
    | 'fallback-parse-response'
    | 'prepare-preview'
    | 'done'
    | 'error'

export type GenerationStage = {
    id: string
    labelId: string
    labelEn: string
    descriptionId?: string
    descriptionEn?: string
    status: GenerationStageStatus
    startedAt?: number
    completedAt?: number
}

export type GenerationProgressDetails = {
    activeFile?: string
    selectedFiles?: string[]
    elapsedMs?: number
}
