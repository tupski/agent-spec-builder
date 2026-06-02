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
    const setPreferredModel = useGeneratorStore((s) => s.setPreferredModel)

    const translated = MODEL_OPTIONS.map((opt) => ({
        value: opt.value,
        label: t(lang, `modelValue_${opt.value}`),
    }))

    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                {t(lang, 'preferredModel')}
                <HelpTooltip tooltipId="preferredModel" lang={lang} />
            </label>
            <Select
                options={translated}
                value={preferredModel}
                onChange={(v) => setPreferredModel(v as any)}
                placeholder={t(lang, 'placeholderModel')}
            />
        </div>
    )
}
