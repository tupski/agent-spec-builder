import type { GeneratedFile } from '../../types'

interface UiUxInput {
    projectName: string
    answers: Record<string, string>
}

export function generateUiUxSpec(input: UiUxInput): GeneratedFile {
    const mobile = input.answers['mobile_requirement'] || 'Mobile-responsive design'

    const content = `# UI/UX Specification

## ${input.projectName}

---

## Visual Direction

- **Theme:** Dark-first design
- **Colors:** Dark backgrounds (near black/slate), cyan/blue accents
- **Typography:** System font stack, clean and readable
- **Borders:** Subtle, low-contrast borders
- **Corners:** Rounded elements (8px-12px radius)
- **Spacing:** Generous whitespace, good vertical rhythm
- **Transitions:** Smooth, subtle animations

## Layout Rules

- Header at top with app name and actions
- Main content area centered and constrained width
- Composer area in the middle of the screen
- Tools placed directly below composer
- Output appears below the composer
- Mobile: single column, full-width elements

## Mobile Behavior

- ${mobile}
- Navigation collapses to essential icons
- Touch targets minimum 44px
- No horizontal overflow
- Content stacks vertically
- Bottom sheet for modals on mobile

## Components

### Header
- Fixed/sticky at top
- App name on left
- Action buttons on right
- Subtle border below

### Composer
- Large, centered textarea
- Auto-grows with content
- Tools directly below
- Generate button prominent

### Question Cards
- Progress bar at top
- Question text prominent
- Option buttons full-width
- Selected option highlighted
- Custom answer expandable

### Output
- File tabs at top
- Markdown rendered in preview
- Mermaid diagrams rendered inline
- Edit, copy, download actions

## Empty States

- **No input:** Show placeholder text in textarea
- **No output:** Show empty state message
- **No drafts:** Show "No saved drafts" message

## Loading States

- **Analyzing:** Animated pulse or skeleton
- **Generating:** Progress indicator
- **Saving:** Brief save status indicator
- **Exporting:** Brief loading spinner

## Error States

- **Validation:** Inline error messages under fields
- **Storage:** Error banner with retry option
- **Export:** Toast notification with error detail
- **Import:** Validation error in dialog

## Accessibility

- Proper heading hierarchy (h1, h2, h3)
- Focus indicators on all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader labels on icon buttons
- Sufficient color contrast
- Reduced motion media query support
`

    return {
        filename: 'UI_UX_SPEC.md',
        content,
        language: 'markdown',
    }
}
