import { useGeneratorStore } from '../../stores/generatorStore'
import { t, type Lang } from '../../lib/i18n/translations'

type Props = {
    lang: Lang
}

type StackField = {
    key: 'frontend' | 'backend' | 'database' | 'auth' | 'storage' | 'deployment' | 'notes'
    labelKey: string
    placeholderKey: string
    helperKey: string
    fullWidth?: boolean
}

const stackFields: StackField[] = [
    { key: 'frontend', labelKey: 'customStackFrontend', placeholderKey: 'customStackFrontendPlaceholder', helperKey: 'customStackFrontendHelper' },
    { key: 'backend', labelKey: 'customStackBackend', placeholderKey: 'customStackBackendPlaceholder', helperKey: 'customStackBackendHelper' },
    { key: 'database', labelKey: 'customStackDatabase', placeholderKey: 'customStackDatabasePlaceholder', helperKey: 'customStackDatabaseHelper' },
    { key: 'auth', labelKey: 'customStackAuth', placeholderKey: 'customStackAuthPlaceholder', helperKey: 'customStackAuthHelper' },
    { key: 'storage', labelKey: 'customStackStorage', placeholderKey: 'customStackStoragePlaceholder', helperKey: 'customStackStorageHelper' },
    { key: 'deployment', labelKey: 'customStackDeployment', placeholderKey: 'customStackDeploymentPlaceholder', helperKey: 'customStackDeploymentHelper' },
    { key: 'notes', labelKey: 'customStackNotes', placeholderKey: 'customStackNotesPlaceholder', helperKey: 'customStackNotesHelper', fullWidth: true },
]

export function CustomStackCard({ lang }: Props) {
    const customStack = useGeneratorStore((s) => s.customStack)
    const setCustomStack = useGeneratorStore((s) => s.setCustomStack)

    return (
        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-1">
                {t(lang, 'customStackTitle')}
            </h3>
            <p className="text-xs text-slate-500 mb-3">
                {t(lang, 'customStackSubtitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stackFields.map(({ key, labelKey, placeholderKey, helperKey, fullWidth }) => (
                    <div key={key} className={fullWidth ? 'md:col-span-2' : ''}>
                        <label className="text-xs text-slate-400 mb-1 block">
                            {t(lang, labelKey)}
                        </label>
                        <input
                            type="text"
                            value={customStack[key] ?? ''}
                            onChange={(e) => setCustomStack({ ...customStack, [key]: e.target.value })}
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
    )
}
