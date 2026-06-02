import { TECH_STACKS } from '../../types'
import { Select } from '../ui/Select'
import { useGeneratorStore } from '../../stores/generatorStore'

export function TechStackSelector() {
    const techStack = useGeneratorStore((s) => s.techStack)
    const customStack = useGeneratorStore((s) => s.customStack)
    const setTechStack = useGeneratorStore((s) => s.setTechStack)
    const setCustomStack = useGeneratorStore((s) => s.setCustomStack)

    const customFields: { key: keyof typeof customStack; label: string }[] = [
        { key: 'frontend', label: 'Frontend' },
        { key: 'backend', label: 'Backend' },
        { key: 'database', label: 'Database' },
        { key: 'auth', label: 'Auth' },
        { key: 'storage', label: 'Storage' },
        { key: 'deployment', label: 'Deployment' },
        { key: 'notes', label: 'Notes' },
    ]

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Tech Stack</label>
            <Select
                options={TECH_STACKS}
                value={techStack}
                onChange={(v) => setTechStack(v as any)}
                placeholder="Pilih Tech Stack"
            />
            {techStack === 'custom' && (
                <div className="mt-2 space-y-2 rounded-lg border border-slate-700 bg-slate-800/30 p-3">
                    {customFields.map(({ key, label }) => (
                        <div key={key}>
                            <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                            <input
                                type="text"
                                value={customStack[key] ?? ''}
                                onChange={(e) => setCustomStack({ ...customStack, [key]: e.target.value })}
                                placeholder={label}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
