export function getRooScopeInstructions(): string {
    return `## Scope & Behavior

- You are an AI coding agent operating on this project.
- Always start by reading the existing codebase structure.
- Never perform large risky rewrites.
- Implement features in small, safe, incremental steps.
- After each change, ensure the app builds and runs.
- Keep TypeScript strict mode enabled.
- Document any significant changes in the project docs.
- Do not add backend, authentication, or paid services unless specified.
- Use the tech stack defined in the project settings.
- Follow the UI/UX spec for all interface decisions.`
}
