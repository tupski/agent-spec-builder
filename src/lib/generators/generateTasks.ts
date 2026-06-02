import type { GeneratedFile } from '../../types'

interface TasksInput {
    projectName: string
    answers: Record<string, string>
}

export function generateTasks(input: TasksInput): GeneratedFile {
    const content = `# Tasks — ${input.projectName}

> Generated checklist for implementation

---

## Phase 0: Project Setup

- [ ] Initialize project repository
- [ ] Configure development environment
- [ ] Set up linting and formatting
- [ ] Create base project structure
- [ ] Install dependencies
- [ ] Configure build tooling
- [ ] **Acceptance:** Project builds and runs with \`npm run dev\`

## Phase 1: Core UI

- [ ] Create layout shell
- [ ] Design header and navigation
- [ ] Build main content area
- [ ] Implement responsive design
- [ ] Add dark theme styling
- [ ] **Acceptance:** UI renders correctly on desktop and mobile

## Phase 2: Data Management

- [ ] Define data models and types
- [ ] Set up state management
- [ ] Implement local storage layer
- [ ] Add data persistence
- [ ] Handle loading and error states
- [ ] **Acceptance:** Data persists across browser refreshes

## Phase 3: Main Features

- [ ] Implement core user flow
- [ ] Add user input handling
- [ ] Process and display data
- [ ] Add interactive elements
- [ ] Implement main actions
- [ ] **Acceptance:** Core features work end-to-end

## Phase 4: Export / Import

- [ ] Add file download functionality
- [ ] Implement clipboard copy
- [ ] Create ZIP export
- [ ] Add backup export
- [ ] Implement backup import
- [ ] **Acceptance:** All export/import features work correctly

## Phase 5: Polish

- [ ] Add loading states
- [ ] Add empty states
- [ ] Add error handling
- [ ] Polish animations and transitions
- [ ] Optimize performance
- [ ] Test on mobile devices
- [ ] **Acceptance:** App feels polished and responsive

## Phase 6: Deployment

- [ ] Configure production build
- [ ] Optimize bundle size
- [ ] Set up deployment pipeline
- [ ] Deploy to production
- [ ] Verify production build
- [ ] **Acceptance:** App deploys and works in production
`

    return {
        filename: 'TASKS.md',
        content,
        language: 'markdown',
    }
}
