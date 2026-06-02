import type { ModelOption } from '../../types'

export interface ModelConfig {
    value: ModelOption
    label: string
    description: string
}

export const MODEL_CONFIGS: Record<string, ModelConfig> = {
    auto: { value: 'auto', label: 'Auto / Let Agent Decide', description: 'Agent will choose the best model for each task.' },
    'claude-sonnet': { value: 'claude-sonnet', label: 'Claude Sonnet', description: 'Best for complex reasoning and code generation.' },
    'claude-haiku': { value: 'claude-haiku', label: 'Claude Haiku', description: 'Fast and cost-effective for simpler tasks.' },
    'gpt-55-thinking': { value: 'gpt-55-thinking', label: 'GPT-5.5 Thinking', description: 'Advanced reasoning with step-by-step thinking.' },
    'gpt-55': { value: 'gpt-55', label: 'GPT-5.5', description: 'Latest GPT model for general purpose coding.' },
    'gpt-41': { value: 'gpt-41', label: 'GPT-4.1', description: 'Reliable model for complex tasks.' },
    'deepseek-coder': { value: 'deepseek-coder', label: 'DeepSeek Coder', description: 'Specialized for code generation.' },
    'deepseek-reasoner': { value: 'deepseek-reasoner', label: 'DeepSeek Reasoner', description: 'Strong reasoning for complex problems.' },
    'qwen-coder': { value: 'qwen-coder', label: 'Qwen Coder', description: 'Lightweight coding model.' },
    'gemini-pro': { value: 'gemini-pro', label: 'Gemini Pro', description: "Google's multimodal model for coding." },
    custom: { value: 'custom', label: 'Custom Model Name', description: 'User-specified model name.' },
}
