import { t, type Lang } from '../../lib/i18n/translations'

type Props = {
    onSelect: (prompt: string) => void
    lang: Lang
}

const EXAMPLES = [
    'exampleSaaS',
    'exampleAgents',
    'exampleLaravel',
    'exampleRefactor',
    'exampleBugfix',
    'exampleDeploy',
] as const

export function ExamplePrompts({ onSelect, lang }: Props) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {EXAMPLES.map((key) => (
                <button
                    key={key}
                    type="button"
                    onClick={() => onSelect(t(lang, `${key}Text`))}
                    className="flex-shrink-0 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-700 hover:bg-slate-700/60 hover:text-cyan-300 transition-colors whitespace-nowrap"
                >
                    {t(lang, key)}
                </button>
            ))}
        </div>
    )
}
