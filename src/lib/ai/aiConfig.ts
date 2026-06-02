export const AI_CONFIG = {
    baseUrl: 'https://9router.artupski.com/v1',
    model: 'free-prd-agents',
    temperature: 0.4,
    maxOutputTokens: 24000,
    timeoutMs: 120000,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
}
