export function getKiroSpecInstructions(): string {
    return `## Spec-First Workflow

Kiro operates on a spec-first methodology:

1. **Requirements** — Read the PRD to understand what needs to be built.
2. **Design** — Read the UI/UX spec and PLAN for architecture decisions.
3. **Tasks** — Use TASKS.md as the execution checklist.
4. **Implementation** — Build features in the specified order.
5. **Verification** — Run tests and type checking after each phase.

### Rules

- Do not skip any phase.
- If a requirement is unclear, check the answers section.
- Keep all generated documents updated as the project evolves.
- Follow the tech stack precisely — do not add unplanned dependencies.`
}
