import { MODEL_OPTIONS } from '../../types'
import { Select } from '../ui/Select'
import { useGeneratorStore } from '../../stores/generatorStore'
import { t, type Lang } from '../../lib/i18n/translations'
import { HelpTooltip } from '../ui/HelpTooltip'

type Props = {
    lang: Lang
}

export function ModelSelector({ lang }: Props) {
    const preferredModel = useGeneratorStore((s) => s.preferredModel)
    const customModelName = useGeneratorStore((s) => s.customModelName)
    const setPreferredModel = useGeneratorStore((s) => s.setPreferredModel)
    const setCustomModelName = useGeneratorStore((s) => s.setCustomModelName)

    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                {t(lang, 'preferredModel')}
                <HelpTooltip tooltipId="preferredModel" lang={lang} />
            </label>
            <Select
                options={MODEL_OPTIONS}
                value={preferredModel}
                onChange={(v) => setPreferredModel(v as any)}
                placeholder={t(lang, 'placeholderModel')}
            />
            {preferredModel === 'custom' && (
                <input
                    type="text"
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    placeholder={t(lang, 'placeholderCustomModel')}
                    className="mt-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                />
            )}
        </div>
    )
}
