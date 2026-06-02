import { ChevronDown, ChevronUp } from 'lucide-react'
import { useGeneratorStore } from '../../stores/generatorStore'
import { t, type Lang } from '../../lib/i18n/translations'
import { HelpTooltip } from '../ui/HelpTooltip'

type Props = {
    lang: Lang
}

type ConstraintField = {
    key: keyof typeof emptyConstraints
    labelKey: string
    placeholderKey: string
    helperKey: string
    tooltipId: string
}

const emptyConstraints = {
    projectName: '',
    targetUsers: '',
    deploymentTarget: '',
    budgetConstraint: '',
    mustHaveFeatures: '',
    mustNotUse: '',
    languagePreference: '',
    conventionPreference: '',
    deadlinePreference: '',
}

const fields: ConstraintField[] = [
    { key: 'projectName', labelKey: 'projectName', placeholderKey: 'placeholderProjectName', helperKey: 'helperProjectName', tooltipId: 'projectName' },
    { key: 'targetUsers', labelKey: 'targetUsers', placeholderKey: 'placeholderTargetUsers', helperKey: 'helperTargetUsers', tooltipId: 'targetUsers' },
    { key: 'deploymentTarget', labelKey: 'deploymentTarget', placeholderKey: 'placeholderDeploymentTarget', helperKey: 'helperDeploymentTarget', tooltipId: 'deploymentTarget' },
    { key: 'budgetConstraint', labelKey: 'budget', placeholderKey: 'placeholderBudget', helperKey: 'helperBudget', tooltipId: 'budget' },
    { key: 'mustHaveFeatures', labelKey: 'mustHaveFeatures', placeholderKey: 'placeholderMustHaveFeatures', helperKey: 'helperMustHaveFeatures', tooltipId: 'mustHaveFeatures' },
    { key: 'mustNotUse', labelKey: 'mustNotUseTechs', placeholderKey: 'placeholderMustNotUse', helperKey: 'helperMustNotUse', tooltipId: 'mustNotUseTechs' },
    { key: 'languagePreference', labelKey: 'languagePreference', placeholderKey: 'placeholderLanguagePreference', helperKey: 'helperLanguagePreference', tooltipId: 'languagePreference' },
    { key: 'conventionPreference', labelKey: 'commentConvention', placeholderKey: 'placeholderConvention', helperKey: 'helperConvention', tooltipId: 'commentConvention' },
    { key: 'deadlinePreference', labelKey: 'deadlinePhase', placeholderKey: 'placeholderDeadline', helperKey: 'helperDeadline', tooltipId: 'deadlinePhase' },
]

export function AdvancedConstraints({ lang }: Props) {
    const show = useGeneratorStore((s) => s.showAdvancedConstraints)
    const constraints = useGeneratorStore((s) => s.advancedConstraints)
    const setShow = useGeneratorStore((s) => s.setShowAdvancedConstraints)
    const setConstraints = useGeneratorStore((s) => s.setAdvancedConstraints)

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
                {t(lang, 'advancedConstraints')}
                <HelpTooltip tooltipId="advancedConstraints" lang={lang} />
            </button>
            {show && (
                <div className="mt-2 rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {fields.map(({ key, labelKey, placeholderKey, helperKey, tooltipId }) => (
                            <div key={key}>
                                <label className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                                    {t(lang, labelKey)}
                                    <HelpTooltip tooltipId={tooltipId} lang={lang} />
                                </label>
                                <input
                                    type="text"
                                    value={constraints[key] ?? ''}
                                    onChange={(e) => setConstraints({ ...constraints, [key]: e.target.value })}
                                    placeholder={t(lang, placeholderKey)}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                                />
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {t(lang, helperKey)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
