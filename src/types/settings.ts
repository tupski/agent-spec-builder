export type AgentTarget =
  | 'kiro'
  | 'roo-code'
  | 'cursor'
  | 'cline'
  | 'claude-code'
  | 'codex'
  | 'windsurf'
  | 'generic'

export const AGENT_TARGETS: { value: AgentTarget; label: string }[] = [
  { value: 'kiro', label: 'Kiro' },
  { value: 'roo-code', label: 'Roo Code' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'cline', label: 'Cline' },
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'codex', label: 'Codex' },
  { value: 'windsurf', label: 'Windsurf' },
  { value: 'generic', label: 'Generic Agentic IDE' },
]

export type ModelOption =
  | 'auto'
  | 'claude-sonnet'
  | 'claude-haiku'
  | 'gpt-55-thinking'
  | 'gpt-55'
  | 'gpt-41'
  | 'deepseek-coder'
  | 'deepseek-reasoner'
  | 'qwen-coder'
  | 'gemini-pro'
  | 'custom'

export const MODEL_OPTIONS: { value: ModelOption; label: string }[] = [
  { value: 'auto', label: 'Auto / Let Agent Decide' },
  { value: 'claude-sonnet', label: 'Claude Sonnet' },
  { value: 'claude-haiku', label: 'Claude Haiku' },
  { value: 'gpt-55-thinking', label: 'GPT-5.5 Thinking' },
  { value: 'gpt-55', label: 'GPT-5.5' },
  { value: 'gpt-41', label: 'GPT-4.1' },
  { value: 'deepseek-coder', label: 'DeepSeek Coder' },
  { value: 'deepseek-reasoner', label: 'DeepSeek Reasoner' },
  { value: 'qwen-coder', label: 'Qwen Coder' },
  { value: 'gemini-pro', label: 'Gemini Pro' },
  { value: 'custom', label: 'Custom Model Name' },
]
