import { AgentSelector } from './AgentSelector'
import { ModelSelector } from './ModelSelector'
import { OutputSelector } from './OutputSelector'
import { TechStackSelector } from './TechStackSelector'
import { AdvancedConstraints } from './AdvancedConstraints'

export function ComposerTools() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <AgentSelector />
                <ModelSelector />
                <OutputSelector />
                <TechStackSelector />
            </div>
            <AdvancedConstraints />
        </div>
    )
}
