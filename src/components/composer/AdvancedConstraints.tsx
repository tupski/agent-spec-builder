import { ChevronDown, ChevronUp } from 'lucide-react'
import { useGeneratorStore } from '../../stores/generatorStore'

export function AdvancedConstraints() {
    const show = useGeneratorStore((s) => s.showAdvancedConstraints)
    const constraints = useGeneratorStore((s) => s.advancedConstraints)
    const setShow = useGeneratorStore((s) => s.setShowAdvancedConstraints)
    const setConstraints = useGeneratorStore((s) => s.setAdvancedConstraints)

    const fields: { key: keyof typeof constraints; label: string; placeholder: string }[] = [
        { key: 'projectName', label: 'Project Name', placeholder: 'Nama project' },
        { key: 'targetUsers', label: 'Target Users', placeholder: 'Siapa pengguna utama?' },
        { key: 'deploymentTarget', label: 'Deployment Target', placeholder: 'Cloudflare Pages, Vercel, dsb.' },
        { key: 'budgetConstraint', label: 'Budget Constraint', placeholder: 'Gratis, ada budget, dsb.' },
        { key: 'mustHaveFeatures', label: 'Must-have Features', placeholder: 'Fitur yang wajib ada' },
        { key: 'mustNotUse', label: 'Must-not-use Technologies', placeholder: 'Teknologi yang tidak boleh dipakai' },
        { key: 'languagePreference', label: 'Language Preference', placeholder: 'Bahasa Indonesia, English, dsb.' },
        { key: 'conventionPreference', label: 'Comment/Naming Convention', placeholder: 'contoh: camelCase, JSDoc' },
        { key: 'deadlinePreference', label: 'Deadline / Phase', placeholder: 'contoh: 1 minggu, ASAP' },
    ]

    return (
        <div>
            <button
                onClick={() => setShow(!show)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
                {show ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                )}
                Advanced Constraints
            </button>
            {show && (
                <div className="mt-2 space-y-2 rounded-lg border border-slate-700 bg-slate-800/30 p-3">
                    {fields.map(({ key, label, placeholder }) => (
                        <div key={key}>
                            <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                            <input
                                type="text"
                                value={constraints[key] ?? ''}
                                onChange={(e) => setConstraints({ ...constraints, [key]: e.target.value })}
                                placeholder={placeholder}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
