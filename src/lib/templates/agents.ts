import type { AgentTarget } from '../../types'

export interface AgentConfig {
    key: AgentTarget
    label: string
    description: string
    instructions: string[]
}

export const AGENT_CONFIGS: Record<AgentTarget, AgentConfig> = {
    'roo-code': {
        key: 'roo-code',
        label: 'Roo Code',
        description: 'AI coding agent for VS Code',
        instructions: [
            'Inspect the existing codebase before making changes.',
            'Avoid large risky rewrites. Implement in small phases.',
            'Keep TypeScript strict mode enabled.',
            'Update documentation after changes.',
            'Run type checking before committing.',
            'Use the existing project conventions.',
            'Do not add backend or authentication unless specified.',
        ],
    },
    kiro: {
        key: 'kiro',
        label: 'Kiro',
        description: 'Spec-first AI coding agent',
        instructions: [
            'Follow spec-first workflow: requirements → design → tasks → implementation.',
            'Start by reading the PRD and PLAN documents.',
            'Implement features in the order specified in TASKS.md.',
            'Keep UI consistent with the UI/UX spec.',
            'Do not skip testing steps.',
            'Use the selected tech stack precisely.',
            'If anything is unclear, check the PLAN.md first.',
        ],
    },
    cursor: {
        key: 'cursor',
        label: 'Cursor',
        description: 'AI-powered code editor',
        instructions: [
            'Use the generated documents as context.',
            'Implement features one at a time.',
            'Follow the tech stack specified in the project.',
            'Run build and tests after each change.',
            'Keep modifications focused and minimal.',
            'Do not rewrite existing functionality.',
        ],
    },
    cline: {
        key: 'cline',
        label: 'Cline',
        description: 'Autonomous coding agent',
        instructions: [
            'Read project documents before starting.',
            'Implement in the phase order specified in PLAN.md.',
            'Use TypeScript types properly throughout.',
            'Ensure the app builds without errors.',
            'Do not add features outside the specified scope.',
            'Test each feature before moving to the next.',
        ],
    },
    'claude-code': {
        key: 'claude-code',
        label: 'Claude Code',
        description: 'Claude-powered coding agent',
        instructions: [
            'Use the PRD as the source of truth for requirements.',
            'Follow PLAN.md for implementation order.',
            'Stick to the tech stack defined in the project.',
            'Generate clean, maintainable code.',
            'Update tests when implementing features.',
            'Document any important decisions.',
        ],
    },
    codex: {
        key: 'codex',
        label: 'Codex',
        description: 'OpenAI-powered coding agent',
        instructions: [
            'Use the generated Markdown documents as project context.',
            'Implement based on TASKS.md checklist.',
            'Follow the architecture outlined in PLAN.md.',
            'Ensure code is production-quality.',
            'Build incrementally and verify each step.',
        ],
    },
    windsurf: {
        key: 'windsurf',
        label: 'Windsurf',
        description: 'AI-powered IDE',
        instructions: [
            'Use the project documents for full context.',
            'Implement features as specified in TASKS.md.',
            'Keep the UI consistent with UI_UX_SPEC.md.',
            'Run builds and tests regularly.',
            'Respect all constraints in the documentation.',
        ],
    },
    generic: {
        key: 'generic',
        label: 'Generic Agentic IDE',
        description: 'Universal coding agent',
        instructions: [
            'Read all generated project documents first.',
            'Follow the implementation plan strictly.',
            'Use the specified tech stack.',
            'Implement features in the defined order.',
            'Keep code modular and maintainable.',
            'Test each feature before proceeding.',
            'Do not exceed the project scope.',
        ],
    },
}
