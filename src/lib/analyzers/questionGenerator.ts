/**
 * questionGenerator.ts — bridge layer
 *
 * Kept as the public API for question generation.
 * Core logic now delegates to AI-based generateQuestions().
 * Local ambiguityAnalyzer/requirementExtractor remain as lightweight pre-check helpers.
 */

export { analyzeAmbiguity } from './ambiguityAnalyzer'
export type { AnalysisResult } from './ambiguityAnalyzer'
export { extractRequirements } from './requirementExtractor'
export type { ExtractedInfo } from './requirementExtractor'

// AI-based question generation — re-export for convenience
export { generateQuestions } from '../ai/generateQuestions'
