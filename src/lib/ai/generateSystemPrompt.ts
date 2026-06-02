export type SystemPromptInput = {
    selectedOutputs: string[]
    agentTarget: string
    model: string
    techStack: string
    advancedConstraints: Record<string, string>
    lang: 'id' | 'en'
    answers: Record<string, string>
}

export function buildSystemPrompt(input: SystemPromptInput): string {
    const {
        selectedOutputs,
        agentTarget,
        model,
        techStack,
        advancedConstraints,
        lang,
        answers,
    } = input

    const constraintsBlock = Object.entries(advancedConstraints)
        .filter(([_, v]) => v)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')

    const answersBlock = Object.entries(answers)
        .filter(([_, v]) => v)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')

    const docList = selectedOutputs.length > 0
        ? selectedOutputs.map((d) => `  - \`${d}\``).join('\n')
        : '  - `output.md` (general document)'

    const languageInstruction =
        lang === 'id'
            ? 'Tulis semua dokumen dalam Bahasa Indonesia. Gunakan bahasa Indonesia yang formal dan jelas.'
            : 'Write all documents in English. Use clear and professional English.'

    return `You are a senior technical product manager and software architect. Your task is to generate high-quality software documentation based on user requirements.

## Language
${languageInstruction}

## Output Format
Return a valid JSON object with this exact structure:
\`\`\`json
{
  "summary": "Short one-paragraph summary of the project",
  "assumptions": ["List of assumptions made during generation"],
  "files": [
    { "filename": "PRD.md", "content": "# PRD\\n\\nFull markdown content..." },
    { "filename": "PLAN.md", "content": "# PLAN\\n\\nFull markdown content..." }
  ],
  "mermaidDiagrams": [
    { "title": "Architecture Diagram", "code": "flowchart TD\\nA[User] --> B[Server]" }
  ]
}
\`\`\`

## Documents to Generate
${docList}

Each file must be valid Markdown with proper headings, lists, and structure. Include Mermaid diagrams inline in markdown files where relevant (using \`\`\`mermaid ... \`\`\` blocks), AND also list them separately in the "mermaidDiagrams" array.

## Context
- **Agent/IDE Target**: ${agentTarget}
- **Model**: ${model}
- **Tech Stack**: ${techStack}
${constraintsBlock ? `\n## Advanced Constraints\n${constraintsBlock}` : ''}
${answersBlock ? `\n## Clarifying Answers\n${answersBlock}` : ''}

## Quality Rules
1. Each document must be thorough and production-ready
2. Use proper Markdown formatting (headings, tables, code blocks, lists)
3. Include actionable content, not placeholders
4. Mermaid diagrams should be syntactically correct
5. Assumptions should list what you inferred from the prompt
6. Summary should be concise (2-3 sentences max)`
}
