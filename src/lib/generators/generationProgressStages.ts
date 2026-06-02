import type { GenerationStage } from '../../types/progress'

/**
 * Event-to-stage mapping for real progress updates.
 * Each GenerationProgressEvent maps to a meaningful stage.
 */
export const STAGE_BY_EVENT: Record<string, { id: string; labelId: string; labelEn: string }> = {
    'prepare-context': {
        id: 'prepare-context',
        labelId: 'Menyiapkan konteks project',
        labelEn: 'Preparing project context',
    },
    'check-ambiguity': {
        id: 'check-ambiguity',
        labelId: 'Mengecek informasi yang masih ambigu',
        labelEn: 'Checking missing or ambiguous information',
    },
    'request-question-generation': {
        id: 'request-question-generation',
        labelId: 'Meminta AI menyusun pertanyaan klarifikasi',
        labelEn: 'Asking AI to prepare clarification questions',
    },
    'waiting-question-response': {
        id: 'waiting-question-response',
        labelId: 'Menunggu daftar pertanyaan dari AI',
        labelEn: 'Waiting for AI-generated questions',
    },
    'parse-question-response': {
        id: 'parse-question-response',
        labelId: 'Memproses pertanyaan dari AI',
        labelEn: 'Processing AI-generated questions',
    },
    'prepare-question-flow': {
        id: 'prepare-question-flow',
        labelId: 'Menyiapkan pertanyaan interaktif',
        labelEn: 'Preparing interactive question flow',
    },
    'merge-answers': {
        id: 'merge-answers',
        labelId: 'Menggabungkan ide awal dan jawaban kamu',
        labelEn: 'Combining original idea with your answers',
    },
    'request-document-generation': {
        id: 'request-document-generation',
        labelId: 'Meminta AI menyusun dokumen yang dipilih',
        labelEn: 'Asking AI to generate selected documents',
    },
    'waiting-document-response': {
        id: 'waiting-document-response',
        labelId: 'Menunggu dokumen dari AI',
        labelEn: 'Waiting for AI-generated documents',
    },
    'parse-ai-response': {
        id: 'parse-ai-response',
        labelId: 'Memproses response AI',
        labelEn: 'Processing AI response',
    },
    'fallback-parse-response': {
        id: 'fallback-parse-response',
        labelId: 'Response AI bukan JSON valid, memakai parser fallback',
        labelEn: 'AI response is not valid JSON, using fallback parser',
    },
    'prepare-preview': {
        id: 'prepare-preview',
        labelId: 'Menyiapkan preview dokumen',
        labelEn: 'Preparing document preview',
    },
    done: {
        id: 'done',
        labelId: 'Selesai',
        labelEn: 'Done',
    },
    error: {
        id: 'error',
        labelId: 'Terjadi kesalahan',
        labelEn: 'Error occurred',
    },
}

export function buildQueryStages(): GenerationStage[] {
    return [
        { ...STAGE_BY_EVENT['prepare-context'], status: 'pending' },
        { ...STAGE_BY_EVENT['check-ambiguity'], status: 'pending' },
        { ...STAGE_BY_EVENT['request-question-generation'], status: 'pending' },
        { ...STAGE_BY_EVENT['waiting-question-response'], status: 'pending' },
        { ...STAGE_BY_EVENT['parse-question-response'], status: 'pending' },
        { ...STAGE_BY_EVENT['prepare-question-flow'], status: 'pending' },
        { ...STAGE_BY_EVENT['merge-answers'], status: 'pending' },
        { ...STAGE_BY_EVENT['request-document-generation'], status: 'pending' },
        { ...STAGE_BY_EVENT['waiting-document-response'], status: 'pending' },
        { ...STAGE_BY_EVENT['parse-ai-response'], status: 'pending' },
        { ...STAGE_BY_EVENT['prepare-preview'], status: 'pending' },
        { ...STAGE_BY_EVENT.done, status: 'pending' },
    ]
}

export function buildDirectStages(): GenerationStage[] {
    return [
        { ...STAGE_BY_EVENT['prepare-context'], status: 'pending' },
        { ...STAGE_BY_EVENT['check-ambiguity'], status: 'pending' },
        { ...STAGE_BY_EVENT['merge-answers'], status: 'pending' },
        { ...STAGE_BY_EVENT['request-document-generation'], status: 'pending' },
        { ...STAGE_BY_EVENT['waiting-document-response'], status: 'pending' },
        { ...STAGE_BY_EVENT['parse-ai-response'], status: 'pending' },
        { ...STAGE_BY_EVENT['prepare-preview'], status: 'pending' },
        { ...STAGE_BY_EVENT.done, status: 'pending' },
    ]
}

export const ACTIVE_MESSAGE_BY_EVENT: Record<string, { id: string; en: string }> = {
    'prepare-context': { id: 'Menyiapkan konteks project...', en: 'Preparing project context...' },
    'check-ambiguity': { id: 'Mengecek informasi yang masih ambigu...', en: 'Checking whether the idea is ambiguous...' },
    'request-question-generation': { id: 'Meminta AI menyusun pertanyaan klarifikasi...', en: 'Asking AI to prepare clarification questions...' },
    'waiting-question-response': { id: 'Menunggu daftar pertanyaan dari AI...', en: 'Waiting for AI-generated questions...' },
    'parse-question-response': { id: 'Memproses pertanyaan dari AI...', en: 'Processing AI-generated questions...' },
    'prepare-question-flow': { id: 'Menyiapkan pertanyaan interaktif...', en: 'Preparing interactive question flow...' },
    'merge-answers': { id: 'Menggabungkan ide awal dan jawaban kamu...', en: 'Combining original idea with your answers...' },
    'request-document-generation': { id: 'Meminta AI menyusun dokumen yang dipilih...', en: 'Asking AI to generate selected documents...' },
    'waiting-document-response': { id: 'Menunggu dokumen dari AI...', en: 'Waiting for AI-generated documents...' },
    'parse-ai-response': { id: 'Memproses response AI...', en: 'Processing AI response...' },
    'fallback-parse-response': { id: 'Response AI bukan JSON valid, memakai parser fallback...', en: 'AI response is not valid JSON, using fallback parser...' },
    'prepare-preview': { id: 'Menyiapkan preview Markdown dan Mermaid...', en: 'Preparing Markdown and Mermaid preview...' },
    done: { id: 'Dokumen selesai dibuat.', en: 'Documents generated successfully.' },
    error: { id: 'Terjadi kesalahan saat memproses.', en: 'An error occurred while processing.' },
}
