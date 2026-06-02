import { AGENT_TARGETS } from '../../types'
import { Select } from '../ui/Select'
import { useGeneratorStore } from '../../stores/generatorStore'
import { t, type Lang } from '../../lib/i18n/translations'
import { HelpTooltip } from '../ui/HelpTooltip'

type Props = {
    lang: Lang
}

export function AgentSelector({ lang }: Props) {
    const agentTarget = useGeneratorStore((s) => s.agentTarget)
    const setAgentTarget = useGeneratorStore((s) => s.setAgentTarget)

    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                {t(lang, 'agentTarget')}
                <HelpTooltip tooltipId="agentTarget" lang={lang} />
            </label>
            <Select
                options={AGENT_TARGETS}
                value={agentTarget}
                onChange={(v) => setAgentTarget(v as any)}
                placeholder={t(lang, 'placeholderAgent')}
            />
        </div>
    )
}
