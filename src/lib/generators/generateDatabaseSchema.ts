import type { GeneratedFile } from '../../types'

interface DBSchemaInput {
    projectName: string
}

export function generateDatabaseSchema(input: DBSchemaInput): GeneratedFile {
    const content = `# Database Schema

## ${input.projectName}

> **Note:** This project uses IndexedDB via Dexie.js for local storage. No server database is required for MVP.

---

## Dexie Database: ArtupskiSpecDB

### Store: projects

| Field | Type | Description |
|-------|------|-------------|
| \`id\` | string (UUID) | Primary key |
| \`title\` | string | Project title / name |
| \`rawIdea\` | string | Original user input |
| \`agentTarget\` | string | Selected agent/IDE |
| \`preferredModel\` | string | Selected model |
| \`selectedOutputs\` | string[] | Selected output documents |
| \`techStack\` | string | Selected tech stack preset |
| \`customStack\` | object | Custom stack fields |
| \`advancedConstraints\` | object | Advanced constraint fields |
| \`questions\` | Question[] | Generated questions |
| \`answers\` | Record<string, string> | User answers |
| \`generatedFiles\` | GeneratedFile[] | Generated documents |
| \`createdAt\` | string (ISO) | Creation timestamp |
| \`updatedAt\` | string (ISO) | Last update timestamp |
| \`version\` | number | Version counter |

**Indexes:** \`id\`, \`title\`, \`updatedAt\`

### Store: templates

| Field | Type | Description |
|-------|------|-------------|
| \`id\` | string | Template identifier |
| \`name\` | string | Template name |
| \`content\` | string | Template content |
| \`type\` | string | Template type |
| \`updatedAt\` | string (ISO) | Last update |

### Store: settings

| Field | Type | Description |
|-------|------|-------------|
| \`id\` | string | Setting key |
| \`value\` | any | Setting value |
| \`updatedAt\` | string (ISO) | Last update |

---

## TypeScript Types

\`\`\`typescript
type ProjectDraft = {
  id: string
  title: string
  rawIdea: string
  agentTarget: string
  preferredModel: string
  selectedOutputs: string[]
  techStack: string
  customStack?: {
    frontend?: string
    backend?: string
    database?: string
    auth?: string
    storage?: string
    deployment?: string
    notes?: string
  }
  advancedConstraints?: Record<string, string>
  questions: Question[]
  answers: Record<string, string>
  generatedFiles: GeneratedFile[]
  createdAt: string
  updatedAt: string
  version: number
}

type GeneratedFile = {
  filename: string
  content: string
  language: 'markdown' | 'text'
}

type Question = {
  id: string
  category: string
  question: string
  helperText?: string
  options: string[]
  required: boolean
}
\`\`\`

## Backup JSON Format

\`\`\`json
{
  "version": 1,
  "exportedAt": "2025-01-01T00:00:00.000Z",
  "projects": [],
  "templates": [],
  "settings": {}
}
\`\`\`
`

    return {
        filename: 'DATABASE_SCHEMA.md',
        content,
        language: 'markdown',
    }
}
