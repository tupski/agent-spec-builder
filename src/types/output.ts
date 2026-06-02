export type OutputDocument =
  | 'AGENTS.md'
  | 'PLAN.md'
  | 'PRD.md'
  | 'README.md'
  | 'DEPLOYMENT.md'
  | 'TASKS.md'
  | 'DATABASE_SCHEMA.md'
  | 'API_SPEC.md'
  | 'UI_UX_SPEC.md'
  | 'TESTING_PLAN.md'
  | 'CHANGELOG.md'
  | '.env.example'

export const FULL_PACKAGE_DOCS: OutputDocument[] = [
  'AGENTS.md',
  'PLAN.md',
  'PRD.md',
  'README.md',
  'DEPLOYMENT.md',
  'TASKS.md',
  'UI_UX_SPEC.md',
  'TESTING_PLAN.md',
]

export const ALL_OUTPUT_DOCS: OutputDocument[] = [
  ...FULL_PACKAGE_DOCS,
  'DATABASE_SCHEMA.md',
  'API_SPEC.md',
  'CHANGELOG.md',
  '.env.example',
]
