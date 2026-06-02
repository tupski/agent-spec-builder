import type { GeneratedFile } from '../../types'

interface TestingInput {
    projectName: string
    answers: Record<string, string>
}

export function generateTestingPlan(input: TestingInput): GeneratedFile {
    const content = `# Testing Plan

## ${input.projectName}

---

## 1. Unit Tests

Test individual functions and utilities:

- [ ] Utility functions (dates, IDs, formatting)
- [ ] Analyzer logic (ambiguity scoring, extraction)
- [ ] Generator logic (each document generator)
- [ ] Storage operations
- [ ] State management actions

## 2. Component Tests

Test UI components in isolation:

- [ ] Button renders correctly
- [ ] Select opens and closes
- [ ] Dialog shows and hides
- [ ] Tabs switch content
- [ ] AutoGrowTextarea resizes properly
- [ ] QuestionCard displays options
- [ ] QuestionFlow navigates questions

## 3. Integration Tests

Test feature workflows:

- [ ] Full generation flow: input → analyze → questions → generate → preview
- [ ] Copy to clipboard
- [ ] Download single file
- [ ] Download ZIP
- [ ] Save draft
- [ ] Load draft
- [ ] Export backup
- [ ] Import backup

## 4. Manual Testing Checklist

### Composer
- [ ] Textarea auto-grows
- [ ] Ctrl+Enter triggers generate
- [ ] All selectors populate correctly
- [ ] Custom model name input shows
- [ ] Custom stack fields show
- [ ] Advanced constraints toggle works

### Analysis & Questions
- [ ] Ambiguity analyzer runs on generate
- [ ] Questions appear one at a time
- [ ] Options are clickable
- [ ] "Jawaban custom" shows text input
- [ ] Navigation (prev/next) works
- [ ] Answer summary shows progress
- [ ] Generate button disabled until all answered

### Output
- [ ] Generated documents display
- [ ] File tabs switch content
- [ ] Markdown renders correctly
- [ ] Mermaid diagrams render (if generated)
- [ ] Copy button copies to clipboard

### Storage
- [ ] Save draft persists data
- [ ] Draft list shows saved items
- [ ] Reopening draft restores state
- [ ] Export backup downloads JSON
- [ ] Import backup restores data

## 5. Browser Tests

Test on these browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## 6. Mobile Tests

- [ ] Layout works on 375px width
- [ ] Touch targets are accessible
- [ ] No horizontal overflow
- [ ] Textarea works on mobile keyboard
- [ ] Dropdowns are usable
- [ ] Question options are tappable

## 7. Export/Import Tests

- [ ] Copy: clipboard has correct content
- [ ] Download .md: file has correct name and content
- [ ] Download ZIP: archive has all files
- [ ] Export backup: JSON contains all data
- [ ] Import backup: validates schema before importing
- [ ] Import backup: rejects invalid JSON

## 8. Persistence Tests

- [ ] Data survives browser refresh
- [ ] Data survives tab close/reopen
- [ ] Multiple drafts can be saved
- [ ] Old drafts can be deleted
`

    return {
        filename: 'TESTING_PLAN.md',
        content,
        language: 'markdown',
    }
}
