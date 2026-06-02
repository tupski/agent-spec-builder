import { AI_CONFIG } from './aiConfig'

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export type CallAiOptions = {
    temperature?: number
    maxOutputTokens?: number
    signal?: AbortSignal
}

function sanitizeError(raw: string): string {
    const key = AI_CONFIG.apiKey
    if (!key) return raw
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return raw.replace(new RegExp(escaped, 'g'), '***')
}

export async function callAi(
    messages: ChatMessage[],
    options?: CallAiOptions
): Promise<string> {
    const controller = new AbortController()
    const timeoutId = setTimeout(
        () => controller.abort(new DOMException('AI request timed out', 'TimeoutError')),
        AI_CONFIG.timeoutMs,
    )

    const signal = options?.signal
        ? anySignal([options.signal, controller.signal])
        : controller.signal

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }
    if (AI_CONFIG.apiKey) {
        headers['Authorization'] = `Bearer ${AI_CONFIG.apiKey}`
    }

    let body: string
    try {
        body = JSON.stringify({
            model: AI_CONFIG.model,
            messages,
            temperature: options?.temperature ?? AI_CONFIG.temperature,
            max_tokens: options?.maxOutputTokens ?? AI_CONFIG.maxOutputTokens,
        })
    } catch (err) {
        clearTimeout(timeoutId)
        throw new Error(`AI request serialization failed: ${(err as Error).message}`)
    }

    const endpoint = `${AI_CONFIG.baseUrl}/chat/completions`

    let response: Response
    try {
        response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body,
            signal,
        })
    } catch (err: unknown) {
        clearTimeout(timeoutId)
        const errMsg = err instanceof Error ? err.message : String(err)
        if (err instanceof DOMException && err.name === 'TimeoutError') {
            throw new Error('AI request timed out')
        }
        if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('AI request was cancelled')
        }
        throw new Error(`AI request failed: ${sanitizeError(errMsg)}`)
    }

    clearTimeout(timeoutId)

    if (!response.ok) {
        let errorText: string
        try {
            const errorJson = await response.json()
            errorText =
                errorJson?.error?.message ||
                errorJson?.message ||
                JSON.stringify(errorJson)
        } catch {
            errorText = await response.text().catch(() => 'Unknown error')
        }
        throw new Error(
            `AI returned ${response.status}: ${sanitizeError(errorText)}`,
        )
    }

    let data: Record<string, unknown>
    try {
        data = await response.json() as Record<string, unknown>
    } catch (err) {
        throw new Error(
            `Failed to parse AI response: ${(err as Error).message}`,
        )
    }

    const choices = data?.choices as Array<Record<string, unknown>> | undefined
    const content = choices?.[0]?.message as Record<string, unknown> | undefined
    const result = typeof content?.content === 'string' ? content.content : undefined

    if (typeof result !== 'string' || result.trim().length === 0) {
        throw new Error('AI returned empty response')
    }

    return result
}

export default callAi

/**
 * Combines multiple AbortSignals into one.
 * Resolves when any signal is aborted.
 */
function anySignal(signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController()

    for (const signal of signals) {
        if (signal.aborted) {
            controller.abort(signal.reason)
            return controller.signal
        }
        signal.addEventListener('abort', () => controller.abort(signal.reason), {
            once: true,
        })
    }

    return controller.signal
}
