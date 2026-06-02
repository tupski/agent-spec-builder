import type { GeneratedFile } from '../../types'
import type { AgentConfig } from '../templates/agents'
import { getRooScopeInstructions } from '../templates/roo'
import { getKiroSpecInstructions } from '../templates/kiro'
import { getGenericAgentInstructions } from '../templates/generic'

interface AgentsInput {
    projectName: string
    agentConfig: AgentConfig
    stackLabel: string
    modelLabel: string
    constraints: Record<string, string> | undefined
    answers: Record<string, string>
}

export function generateAgentsMd(input: AgentsInput): GeneratedFile {
    const agentInstructions = input.agentConfig.key === 'roo-code'
        ? getRooScopeInstructions()
        : input.agentConfig.key === 'kiro'
            ? getKiroSpecInstructions()
            : getGenericAgentInstructions()

    const lang = input.constraints?.languagePreference || input.answers['language_preference'] || 'English'
    const convention = input.constraints?.conventionPreference || 'Follow existing project conventions'

    const content = `# AGENTS.md — AI Agent Instructions

## Project: ${input.projectName}

### Agent Configuration

- **Agent:** ${input.agentConfig.label}
- **Model:** ${input.modelLabel}
- **Stack:** ${input.stackLabel}
- **Language:** ${lang}

---

## Role

You are an AI coding agent working on **${input.projectName}**.

${input.agentConfig.description}

## Project Goal

${input.projectName} is built to solve a specific user need. All implementation decisions should align with the PRD and PLAN documents.

## Tech Stack

- **Frontend:** Part of ${input.stackLabel} stack
- **State Management:** As defined in the project
- **Storage:** As defined in the project
- **Testing:** As defined in TESTING_PLAN.md

## Coding Rules

1. Follow TypeScript strict mode throughout.
2. Use the naming conventions already established: ${convention}.
3. Keep functions small, focused, and testable.
4. Prefer pure functions where possible.
5. Use early returns to reduce nesting.
6. Keep components modular with clear responsibilities.

## File Naming Rules

- Components: PascalCase (\`MyComponent.tsx\`)
- Utilities: camelCase (\`formatDate.ts\`)
- Types: camelCase (\`project.ts\`)
- Styles: Use Tailwind classes (no separate CSS files)

## UI Rules

- Use the existing design system components.
- Follow the dark-first theme.
- Ensure mobile responsiveness.
- Use proper semantic HTML.
- Maintain accessible contrast ratios.

## State Management Rules

- Use Zustand for global state.
- Keep component state local when possible.
- Use TypeScript for all state shapes.
- Do not mix state patterns unnecessarily.

## Storage Rules

- Use Dexie.js / IndexedDB for persistence.
- Handle loading and error states.
- Validate data before saving.
- Use the defined repository pattern.

## Testing Rules

- Write tests as specified in TESTING_PLAN.md.
- Test both success and error paths.
- Test edge cases.

## Output Expectations

- All code must be production quality.
- No console.log in production code.
- No TODO comments in final code.
- Proper error handling throughout.

${agentInstructions}

## Things the Agent Must NOT Do

- Do not add backend or server code.
- Do not add authentication unless specified.
- Do not add paid service integrations.
- Do not add AI API integration.
- Do not perform large rewrites.
- Do not add unplanned dependencies.
- Do not modify configuration files unless needed.
- Do not change the project structure drastically.
`

    return {
        filename: 'AGENTS.md',
        content,
        language: 'markdown',
    }
}
