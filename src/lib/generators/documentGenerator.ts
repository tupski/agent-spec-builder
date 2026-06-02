// LEGACY: Local template-based generator preserved as fallback.
// AI generation now happens in src/stores/generatorStore.ts via callAi().

import type {
    GeneratedFile,
    OutputDocument,
    AgentTarget,
    TechStackPreset,
    AdvancedConstraints,
    Question,
} from '../../types'
import { AGENT_CONFIGS } from '../templates/agents'
import { STACK_INFO } from '../templates/stacks'
import { MODEL_CONFIGS } from '../templates/models'
import { generatePrd } from './generatePrd'
import { generatePlan } from './generatePlan'
import { generateAgentsMd } from './generateAgentsMd'
import { generateReadme } from './generateReadme'
import { generateDeployment } from './generateDeployment'
import { generateTasks } from './generateTasks'
import { generateUiUxSpec } from './generateUiUxSpec'
import { generateTestingPlan } from './generateTestingPlan'
import { generateDatabaseSchema } from './generateDatabaseSchema'
import { generateMermaidDiagrams } from './generateMermaid'

interface GenerateInput {
    rawIdea: string
    agentTarget: AgentTarget
    preferredModel: string
    customModelName?: string
    selectedOutputs: OutputDocument[]
    techStack: TechStackPreset
    customStack: Record<string, string> | undefined
    advancedConstraints: AdvancedConstraints | undefined
    questions: Question[]
    answers: Record<string, string>
}

export function generateDocuments(input: GenerateInput): GeneratedFile[] {
    const files: GeneratedFile[] = []

    const agentConfig = AGENT_CONFIGS[input.agentTarget] ?? AGENT_CONFIGS['roo-code']
    const stackInfo = STACK_INFO[input.techStack] ?? STACK_INFO.auto
    const modelConfig = MODEL_CONFIGS[input.preferredModel]
    const modelLabel = input.preferredModel === 'custom' && input.customModelName
        ? input.customModelName
        : modelConfig?.label ?? input.preferredModel

    const projectName = input.advancedConstraints?.projectName
        || input.answers['project_name']
        || 'Project'

    if (input.selectedOutputs.includes('PRD.md')) {
        files.push(generatePrd({
            rawIdea: input.rawIdea,
            agentLabel: agentConfig.label,
            modelLabel,
            stack: input.techStack,
            customStack: input.customStack,
            constraints: input.advancedConstraints,
            answers: input.answers,
            questions: input.questions,
        }))
    }

    if (input.selectedOutputs.includes('PLAN.md')) {
        files.push(generatePlan({
            rawIdea: input.rawIdea,
            projectName,
            stack: input.techStack,
            stackLabel: stackInfo.label,
            answers: input.answers,
        }))
    }

    if (input.selectedOutputs.includes('AGENTS.md')) {
        files.push(generateAgentsMd({
            projectName,
            agentConfig,
            stackLabel: stackInfo.label,
            modelLabel,
            constraints: input.advancedConstraints as Record<string, string> | undefined,
            answers: input.answers,
        }))
    }

    if (input.selectedOutputs.includes('README.md')) {
        files.push(generateReadme({
            projectName,
            rawIdea: input.rawIdea,
            stackLabel: stackInfo.label,
            constraints: input.advancedConstraints as Record<string, string> | undefined,
        }))
    }

    if (input.selectedOutputs.includes('DEPLOYMENT.md')) {
        files.push(generateDeployment({
            projectName,
            answers: input.answers,
        }))
    }

    if (input.selectedOutputs.includes('TASKS.md')) {
        files.push(generateTasks({
            projectName,
            answers: input.answers,
        }))
    }

    if (input.selectedOutputs.includes('UI_UX_SPEC.md')) {
        files.push(generateUiUxSpec({
            projectName,
            answers: input.answers,
        }))
    }

    if (input.selectedOutputs.includes('TESTING_PLAN.md')) {
        files.push(generateTestingPlan({
            projectName,
            answers: input.answers,
        }))
    }

    if (input.selectedOutputs.includes('DATABASE_SCHEMA.md')) {
        files.push(generateDatabaseSchema({
            projectName,
        }))
    }

    // Generate Mermaid diagrams
    const diagrams = generateMermaidDiagrams(projectName)
    if (diagrams.length > 0) {
        files.push({
            filename: '.mermaid-diagrams.md',
            content: `# Mermaid Diagrams\n\n${diagrams.join('\n\n---\n\n')}`,
            language: 'markdown',
        })
    }

    return files
}
