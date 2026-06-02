export type ParsedAiResponse = {
    files: { filename: string; content: string }[]
    mermaidDiagrams: { title: string; code: string }[]
    summary: string
    assumptions: string[]
    usedFallback: boolean
}

function tryExtractJsonBlock(raw: string): Record<string, unknown> | null {
    // Try ```json ... ``` block
    const jsonBlockMatch = raw.match(/```json\n?([\s\S]*?)```/)
    if (jsonBlockMatch) {
        try {
            return JSON.parse(jsonBlockMatch[1].trim())
        } catch {
            return null
        }
    }

    // Try ``` ... ``` block
    const codeBlockMatch = raw.match(/```\n?([\s\S]*?)```/)
    if (codeBlockMatch) {
        try {
            return JSON.parse(codeBlockMatch[1].trim())
        } catch {
            return null
        }
    }

    return null
}

function tryParseWhole(raw: string): Record<string, unknown> | null {
    try {
        return JSON.parse(raw.trim())
    } catch {
        return null
    }
}

function normalizeToFiles(
    files: unknown,
    fallbackContent: string,
): { filename: string; content: string }[] {
    if (!Array.isArray(files) || files.length === 0) {
        return [{ filename: 'output.md', content: fallbackContent }]
    }

    return files.map((f: unknown) => {
        const entry = f as Record<string, unknown>
        return {
            filename:
                typeof entry.filename === 'string' && entry.filename.trim()
                    ? entry.filename.trim()
                    : 'output.md',
            content:
                typeof entry.content === 'string' && entry.content.trim()
                    ? entry.content.trim()
                    : fallbackContent,
        }
    })
}

export function parseAiResponse(raw: string): ParsedAiResponse {
    const empty: ParsedAiResponse = {
        files: [],
        mermaidDiagrams: [],
        summary: '',
        assumptions: [],
        usedFallback: false,
    }

    if (!raw || !raw.trim()) {
        return empty
    }

    // 1. Try to extract JSON
    let parsed = tryExtractJsonBlock(raw)
    if (!parsed) {
        parsed = tryParseWhole(raw)
    }

    if (!parsed) {
        // Not JSON at all — wrap entire response as output.md
        return {
            files: [{ filename: 'output.md', content: raw.trim() }],
            mermaidDiagrams: [],
            summary: '',
            assumptions: [],
            usedFallback: true,
        }
    }

    // 2. Normalize summary
    const summary =
        typeof parsed.summary === 'string'
            ? parsed.summary.trim()
            : typeof parsed.summary === 'object' && parsed.summary !== null
                ? JSON.stringify(parsed.summary)
                : ''

    // 3. Normalize assumptions
    let assumptions: string[] = []
    if (Array.isArray(parsed.assumptions)) {
        assumptions = parsed.assumptions
            .filter((a): a is string => typeof a === 'string')
            .map((a) => a.trim())
            .filter(Boolean)
    }

    // 4. Normalize files
    const fallbackContent = raw.trim()
    const files = normalizeToFiles(parsed.files, fallbackContent)

    // 5. Normalize mermaidDiagrams
    let mermaidDiagrams: { title: string; code: string }[] = []
    if (Array.isArray(parsed.mermaidDiagrams)) {
        mermaidDiagrams = parsed.mermaidDiagrams
            .filter((d): d is { title: string; code: string } => {
                if (!d || typeof d !== 'object') return false
                const obj = d as Record<string, unknown>
                return typeof obj.code === 'string' && obj.code.trim().length > 0
            })
            .map((d) => ({
                title:
                    typeof (d as Record<string, unknown>).title === 'string'
                        ? ((d as Record<string, unknown>).title as string).trim()
                        : 'Diagram',
                code: ((d as Record<string, unknown>).code as string).trim(),
            }))
    }

    // 6. Extract mermaid blocks from file contents that aren't already in mermaidDiagrams
    const existingCodes = new Set(mermaidDiagrams.map((d) => d.code))
    for (const file of files) {
        const mermaidRegex = /```mermaid\n([\s\S]*?)```/g
        let match: RegExpExecArray | null
        while ((match = mermaidRegex.exec(file.content)) !== null) {
            const code = match[1].trim()
            if (code && !existingCodes.has(code)) {
                mermaidDiagrams.push({
                    title: `Diagram from ${file.filename}`,
                    code,
                })
                existingCodes.add(code)
            }
        }
    }

    return { files, mermaidDiagrams, summary, assumptions, usedFallback: false }
}
