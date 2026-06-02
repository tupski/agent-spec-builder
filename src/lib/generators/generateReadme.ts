import type { GeneratedFile } from '../../types'

interface ReadmeInput {
    projectName: string
    rawIdea: string
    stackLabel: string
    constraints: Record<string, string> | undefined
}

export function generateReadme(input: ReadmeInput): GeneratedFile {
    const content = `# ${input.projectName}

> ${input.rawIdea.slice(0, 100)}${input.rawIdea.length > 100 ? '...' : ''}

## Features

- Core functionality based on user requirements
- Modern, responsive user interface
- ${input.stackLabel}
- Local-first data storage
- Export and import capabilities

## Tech Stack

- **Frontend:** ${input.stackLabel}
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Storage:** Dexie.js / IndexedDB
- **UI Components:** Radix UI primitives

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
npm run preview
\`\`\`

## Project Structure

\`\`\`
src/
├── app/           # App entry point
├── components/    # UI components
│   ├── layout/    # Layout components
│   ├── composer/  # Input area components
│   ├── questions/ # Question flow components
│   ├── output/    # Output preview components
│   ├── drafts/    # Draft management
│   └── ui/        # Base UI primitives
├── lib/           # Logic and utilities
│   ├── analyzers/ # Ambiguity analysis
│   ├── generators/# Document generators
│   ├── templates/ # Template data
│   ├── storage/   # Dexie database layer
│   └── utils/     # Utilities
├── stores/        # Zustand stores
├── types/         # TypeScript types
└── styles/        # Global styles
\`\`\`

## Usage Guide

1. Enter your project idea in the textarea
2. Select agent target, model, output documents, and tech stack
3. Click Generate or press Ctrl/Cmd + Enter
4. Answer clarifying questions if needed
5. Review generated documents
6. Copy, download, or export your documents

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## License

MIT
`

    return {
        filename: 'README.md',
        content,
        language: 'markdown',
    }
}
