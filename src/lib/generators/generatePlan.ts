import type { GeneratedFile } from '../../types'

interface PlanInput {
    rawIdea: string
    projectName: string
    stack: string
    stackLabel: string
    answers: Record<string, string>
}

export function generatePlan(input: PlanInput): GeneratedFile {
    const content = `# Development Plan

## ${input.projectName}

> **Stack:** ${input.stackLabel}

---

## Phase 0: Project Setup

- [ ] Initialize project with ${input.stack}
- [ ] Configure development environment
- [ ] Set up version control
- [ ] Define folder structure
- [ ] Configure linting and formatting

## Phase 1: Core UI

- [ ] Build main layout shell
- [ ] Implement core components
- [ ] Set up state management
- [ ] Create responsive design
- [ ] Implement navigation

## Phase 2: Data Model / Storage

- [ ] Define data types and interfaces
- [ ] Implement storage layer
- [ ] Create data access methods
- [ ] Add data validation
- [ ] Implement data persistence

## Phase 3: Main Features

- [ ] Implement core functionality
- [ ] Add user interactions
- [ ] Process and display data
- [ ] Handle error states
- [ ] Add loading states

## Phase 4: Export / Import

- [ ] Implement file download
- [ ] Add export functionality
- [ ] Implement import functionality
- [ ] Add clipboard copy
- [ ] Create backup system

## Phase 5: Testing

- [ ] Write unit tests for utilities
- [ ] Test storage layer
- [ ] Test user interactions
- [ ] Test export/import flows
- [ ] Manual testing across features

## Phase 6: Deployment

- [ ] Configure build process
- [ ] Optimize production bundle
- [ ] Set up CI/CD
- [ ] Deploy to ${input.answers['deployment_target'] || 'target platform'}
- [ ] Verify production build

## Risks

- Scope creep from unplanned features
- Browser compatibility issues
- Performance with large datasets
- ${input.answers['auth_requirement'] && input.answers['auth_requirement'] !== 'Tidak, publik saja' ? 'Authentication complexity' : 'Minimal auth risk'}

## Dependencies

- Node.js >= 18
- Modern browser (Chrome, Firefox, Safari, Edge)
- ${input.stackLabel}
`

    return {
        filename: 'PLAN.md',
        content,
        language: 'markdown',
    }
}
