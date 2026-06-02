export function getGenericAgentInstructions(): string {
    return `## Universal Coding Agent Instructions

### Before Starting
- Read all project documents: PRD.md, PLAN.md, AGENTS.md, README.md, DEPLOYMENT.md, TASKS.md.
- Examine the existing codebase structure and conventions.
- Understand the tech stack and project constraints.

### During Implementation
- Follow TASKS.md in order.
- Implement one feature at a time and verify it works.
- Keep code modular, typed, and well-structured.
- Follow the naming conventions in the existing codebase.
- Do not add dependencies outside the approved tech stack.
- Keep the UI consistent with the specified design direction.

### Quality
- Ensure TypeScript compiles without errors.
- Test manually after each major change.
- Keep the app deployable at all times.
- Update documentation when adding features.`
}
