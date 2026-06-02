import type { GeneratedFile, AdvancedConstraints } from '../../types'
import { STACK_INFO } from '../templates/stacks'

interface PrdInput {
    rawIdea: string
    agentLabel: string
    modelLabel: string
    stack: string
    customStack: Record<string, string> | undefined
    constraints: AdvancedConstraints | undefined
    answers: Record<string, string>
    questions: { id: string; question: string }[]
}

export function generatePrd(input: PrdInput): GeneratedFile {
    const stackInfo = STACK_INFO[input.stack] ?? STACK_INFO.auto
    const projectName = input.constraints?.projectName || input.answers['project_name'] || 'Project'
    const targetUsers = input.constraints?.targetUsers || input.answers['target_users'] || 'TBD'
    const features = input.answers['core_features'] || 'Based on user requirements'
    const auth = input.answers['auth_requirement'] || 'TBD'
    const db = input.answers['database_requirement'] || 'TBD'
    const payment = input.answers['payment_requirement'] || 'TBD'
    const deployment = input.constraints?.deploymentTarget || input.answers['deployment_target'] || 'TBD'

    const content = `# Product Requirements Document (PRD)

## ${projectName}

> **Generated for:** ${input.agentLabel}
> **Model:** ${input.modelLabel}
> **Stack:** ${stackInfo.label}

---

## 1. Product Overview

${input.rawIdea}

## 2. Problem Statement

${input.answers['problem_statement'] || 'A clear problem statement needs to be defined based on user input.'}

## 3. Goals

- Build a functional and reliable application
- Deliver good user experience
- Ensure code quality and maintainability
- Enable future extensibility

## 4. Non-Goals

- Adding features outside the defined scope
- Supporting legacy browsers/devices unless specified
- Building native mobile apps unless specified

## 5. Target Users

**Primary users:** ${targetUsers}

${input.answers['target_users_detail'] ? `**Detail:** ${input.answers['target_users_detail']}` : ''}

## 6. Core Features

${features}

## 7. Functional Requirements

- User can interact with the main interface
- ${auth !== 'Tidak, publik saja' ? 'User authentication and authorization' : 'Public access without authentication'}
- ${db !== 'Tidak perlu' ? 'Data persistence and management' : 'Local data handling'}
- ${payment !== 'Tidak perlu' ? 'Payment processing integration' : 'No payment processing required'}
- Input validation and error handling
- Responsive user interface

## 8. Non-Functional Requirements

- **Frontend:** ${stackInfo.frontend}
- **Backend:** ${stackInfo.backend}
- **Database:** ${stackInfo.database}
- **Deployment:** ${deployment}
- Performance: Fast load times, optimized bundle
- Accessibility: Basic web accessibility standards
- Security: ${auth !== 'Tidak, publik saja' ? 'Authentication and data protection' : 'Basic security practices'}
- Mobile: ${input.answers['mobile_requirement'] === 'Tidak, desktop-only' ? 'Desktop-optimized' : 'Mobile-responsive design'}

## 9. Integrations

${input.answers['api_requirement'] === 'Tidak perlu API' ? 'No external API integrations for MVP.' : 'External API integration as specified.'}

## 10. Acceptance Criteria

- All core features are implemented and functional
- The app builds without errors
- The UI matches the specified design direction
- Data is properly stored and retrieved
- ${auth !== 'Tidak, publik saja' ? 'Authentication flow works correctly' : 'Public access works correctly'}

## 11. Open Questions

- Final design direction and branding
- Specific third-party service selections
- Detailed performance benchmarks

## 12. Assumptions

- User has basic technical knowledge to operate the app
- Modern browser or runtime environment is available
- ${deployment !== 'TBD' ? `Deployment target: ${deployment}` : 'Deployment target will be determined later'}
- ${input.constraints?.budgetConstraint ? `Budget constraint: ${input.constraints.budgetConstraint}` : 'No specific budget constraints'}
`

    return {
        filename: 'PRD.md',
        content,
        language: 'markdown',
    }
}
