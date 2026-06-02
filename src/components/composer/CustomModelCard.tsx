import { useGeneratorStore } from '../../stores/generatorStore'
import { t, type Lang } from '../../lib/i18n/translations'

type Props = {
    lang: Lang
}

export function CustomModelCard({ lang }: Props) {
    const customModelName = useGeneratorStore((s) => s.customModelName)
    const setCustomModelName = useGeneratorStore((s) => s.setCustomModelName)

    return (
        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">
                {t(lang, 'customModelTitle')}
            </h3>
            <div>
                <label className="text-xs text-slate-400 mb-1 block">
                    {t(lang, 'customModelLabel')}
                </label>
                <input
                    type="text"
                    value={customModelName}
                    onChange={(e) => setCustomModelName(e.target.value)}
                    placeholder={t(lang, 'customModelPlaceholder')}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                />
                <p className="mt-1 text-xs text-slate-500">
                    {t(lang, 'customModelHelper')}
                </p>
            </div>
        </div>
    )
}
