export interface CustomStack {
  frontend?: string
  backend?: string
  database?: string
  auth?: string
  storage?: string
  deployment?: string
  notes?: string
}

export interface AdvancedConstraints {
  projectName?: string
  targetUsers?: string
  deploymentTarget?: string
  budgetConstraint?: string
  mustHaveFeatures?: string
  mustNotUse?: string
  languagePreference?: string
  conventionPreference?: string
  deadlinePreference?: string
}

export interface GeneratedFile {
  filename: string
  content: string
  language: 'markdown' | 'text'
}

export interface ProjectDraft {
  id: string
  title: string
  rawIdea: string
  agentTarget: string
  preferredModel: string
  selectedOutputs: string[]
  techStack: string
  customStack?: CustomStack
  advancedConstraints?: AdvancedConstraints
  questions: import('./question').Question[]
  answers: Record<string, string>
  generatedFiles: GeneratedFile[]
  createdAt: string
  updatedAt: string
  version: number
}
