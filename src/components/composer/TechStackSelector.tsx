import { TECH_STACKS } from '../../types'
import { Select } from '../ui/Select'
import { useGeneratorStore } from '../../stores/generatorStore'
import { t, type Lang } from '../../lib/i18n/translations'
import { HelpTooltip } from '../ui/HelpTooltip'

type Props = {
    lang: Lang
}

export function TechStackSelector({ lang }: Props) {
    const techStack = useGeneratorStore((s) => s.techStack)
    const setTechStack = useGeneratorStore((s) => s.setTechStack)

    const translated = TECH_STACKS.map((opt) => ({
        value: opt.value,
        label: t(lang, `stackValue_${opt.value}`),
    }))

    return (
        <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                {t(lang, 'techStack')}
                <HelpTooltip tooltipId="techStack" lang={lang} />
            </label>
            <Select
                options={translated}
                value={techStack}
                onChange={(v) => setTechStack(v as any)}
                placeholder={t(lang, 'placeholderStack')}
            />
        </div>
    )
}
