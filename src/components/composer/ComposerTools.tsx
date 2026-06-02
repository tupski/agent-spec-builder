import { AgentSelector } from './AgentSelector'
import { ModelSelector } from './ModelSelector'
import { OutputSelector } from './OutputSelector'
import { TechStackSelector } from './TechStackSelector'
import { CustomModelCard } from './CustomModelCard'
import { CustomStackCard } from './CustomStackCard'
import { AdvancedConstraints } from './AdvancedConstraints'
import { useGeneratorStore } from '../../stores/generatorStore'
import type { Lang } from '../../lib/i18n/translations'

type Props = {
    lang: Lang
}

export function ComposerTools({ lang }: Props) {
    const selectedOutputs = useGeneratorStore((s) => s.selectedOutputs)
    const setSelectedOutputs = useGeneratorStore((s) => s.setSelectedOutputs)
    const preferredModel = useGeneratorStore((s) => s.preferredModel)
    const techStack = useGeneratorStore((s) => s.techStack)

    return (
        <div className="space-y-4">
            {/* Main controls: 4-col grid */}
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
                <AgentSelector lang={lang} />
                <ModelSelector lang={lang} />
                <OutputSelector
                    lang={lang}
                    value={selectedOutputs}
                    onChange={setSelectedOutputs}
                />
                <TechStackSelector lang={lang} />
            </div>

            {/* Custom Model card — full width when visible */}
            {preferredModel === 'custom' && (
                <CustomModelCard lang={lang} />
            )}

            {/* Custom Stack card — full width when visible */}
            {techStack === 'custom' && (
                <CustomStackCard lang={lang} />
            )}

            <AdvancedConstraints lang={lang} />
        </div>
    )
}
