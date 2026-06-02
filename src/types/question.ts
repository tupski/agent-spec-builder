export type QuestionCategory =
  | 'product'
  | 'users'
  | 'features'
  | 'tech_stack'
  | 'database'
  | 'deployment'
  | 'ui_ux'
  | 'security'
  | 'business'
  | 'content'

export interface Question {
  id: string
  category: QuestionCategory
  question: string
  helperText?: string
  options: string[]
  required: boolean
}
