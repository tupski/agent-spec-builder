import { AGENT_TARGETS } from '../../types'
import { Select } from '../ui/Select'
import { useGeneratorStore } from '../../stores/generatorStore'

export function AgentSelector() {
    const agentTarget = useGeneratorStore((s) => s.agentTarget)
    const setAgentTarget = useGeneratorStore((s) => s.setAgentTarget)

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Agent / IDE Target</label>
            <Select
                options={AGENT_TARGETS}
                value={agentTarget}
                onChange={(v) => setAgentTarget(v as any)}
                placeholder="Pilih Agent / IDE"
            />
        </div>
    )
}
