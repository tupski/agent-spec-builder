import { callAi } from './aiClient'
import type { Question, QuestionCategory } from '../../types'

const MAX_QUESTIONS = 10

function buildPrompt(prompt: string, lang: 'id' | 'en'): string {
    const languageInstruction =
        lang === 'id'
            ? 'Gunakan Bahasa Indonesia untuk semua pertanyaan.'
            : 'Use English for all questions.'

    return `You are a requirements analyst. A user has provided a project idea, but it may be missing important details.

${languageInstruction}

Analyze the user's idea and generate clarifying questions. Each question must help fill a critical gap.

Return a JSON array of objects with this exact structure:
[
  {
    "id": "q_unique_string",
    "category": "product|users|features|tech_stack|database|deployment|ui_ux|security|business|content",
    "question": "The question text",
    "helperText": "Brief explanation of why this matters",
    "options": ["Option 1", "Option 2", "Option 3", "Custom answer"],
    "required": true
  }
]

Rules:
- Generate at most ${MAX_QUESTIONS} questions
- Only ask about truly missing or ambiguous aspects
- Each question must have 2-5 predefined options
- The LAST option in each question's options array MUST always be "${lang === 'id' ? 'Jawaban custom' : 'Custom answer'}"
- Questions should be high-impact — skip nice-to-have details
- Return ONLY the JSON array, no extra text

User's idea:
"""
${prompt.trim()}
"""`
}

export async function generateQuestions(
    prompt: string,
    lang: 'id' | 'en',
    signal?: AbortSignal,
): Promise<Question[]> {
    if (!prompt || !prompt.trim()) {
        return []
    }

    const systemMessage = buildPrompt(prompt, lang)

    try {
        const raw = await callAi([
            { role: 'system', content: systemMessage },
            { role: 'user', content: prompt },
        ], { temperature: 0.3, signal })

        // Try to extract JSON array from response
        let jsonStr = raw.trim()

        // Extract from markdown code block if present
        const jsonBlockMatch = jsonStr.match(/```(?:json)?\n?([\s\S]*?)```/)
        if (jsonBlockMatch) {
            jsonStr = jsonBlockMatch[1].trim()
        }

        const parsed = JSON.parse(jsonStr)

        if (!Array.isArray(parsed)) {
            return []
        }

        const questions: Question[] = parsed
            .filter((item: unknown): item is Record<string, unknown> => {
                if (!item || typeof item !== 'object') return false
                const obj = item as Record<string, unknown>
                return (
                    typeof obj.id === 'string' &&
                    typeof obj.question === 'string' &&
                    Array.isArray(obj.options)
                )
            })
            .map((item) => {
                const options = [...(item.options as string[])]
                // Ensure last option is always the custom answer
                const customAnswer = lang === 'id' ? 'Jawaban custom' : 'Custom answer'
                if (options[options.length - 1] !== customAnswer) {
                    // Check if custom answer is already somewhere
                    const existingIdx = options.indexOf(customAnswer)
                    if (existingIdx >= 0) {
                        // Move to end
                        options.splice(existingIdx, 1)
                    }
                    options.push(customAnswer)
                }
                const category = (item.category as string) || 'product'
                return {
                    id: item.id as string,
                    category: (['product', 'users', 'features', 'tech_stack', 'database', 'deployment', 'ui_ux', 'security', 'business', 'content'].includes(category)
                        ? category
                        : 'product') as QuestionCategory,
                    question: item.question as string,
                    helperText: (item.helperText as string) || '',
                    options,
                    required: item.required !== false,
                }
            })
            .slice(0, MAX_QUESTIONS)

        return questions
    } catch {
        // If AI fails or returns invalid JSON, return empty array (skip questions)
        return []
    }
}
