import { useState } from 'react'
import { Button } from '../ui/Button'
import { t, type Lang } from '../../lib/i18n/translations'

interface CustomAnswerInputProps {
    onSubmit: (answer: string) => void
    lang: Lang
}

export function CustomAnswerInput({ onSubmit, lang }: CustomAnswerInputProps) {
    const [value, setValue] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = () => {
        if (!value.trim()) return
        onSubmit(value.trim())
        setSubmitted(true)
    }

    if (submitted) {
        return <p className="text-sm text-emerald-400">✓ {t(lang, 'answerSaved')}</p>
    }

    return (
        <div className="flex flex-col gap-2">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t(lang, 'writeAnswer')}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 min-h-[80px]"
                autoFocus
            />
            <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={!value.trim()} size="sm">
                    {t(lang, 'saveAnswer')}
                </Button>
            </div>
        </div>
    )
}
