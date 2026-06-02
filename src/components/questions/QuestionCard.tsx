import { useState } from 'react'
import type { Question } from '../../types'
import { CustomAnswerInput } from './CustomAnswerInput'
import { useGeneratorStore } from '../../stores/generatorStore'
import { cn } from '../../lib/utils/cn'
import { t, type Lang } from '../../lib/i18n/translations'

interface QuestionCardProps {
    question: Question
    questionNumber: number
    totalQuestions: number
    lang: Lang
}

export function QuestionCard({
    question,
    questionNumber,
    totalQuestions,
    lang,
}: QuestionCardProps) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [showCustom, setShowCustom] = useState(false)
    const [answered, setAnswered] = useState(false)
    const answerQuestion = useGeneratorStore((s) => s.answerQuestion)

    const customAnswerLabel = lang === 'id' ? 'Jawaban custom' : 'Custom answer'

    const handleSelectOption = (option: string) => {
        if (option === customAnswerLabel) {
            setShowCustom(true)
            setSelectedOption(null)
            return
        }
        setSelectedOption(option)
        setShowCustom(false)
        answerQuestion(question.id, option)
        setAnswered(true)
    }

    const handleCustomSubmit = (answer: string) => {
        answerQuestion(question.id, answer)
        setAnswered(true)
    }

    const progressPercent = (questionNumber / totalQuestions) * 100

    if (answered) {
        return (
            <div className="rounded-xl border border-emerald-700/50 bg-emerald-900/20 p-4 text-center">
                <p className="text-emerald-400 font-medium">✓ {t(lang, 'answerSaved')}</p>
                <p className="text-sm text-slate-400 mt-1">
                    {selectedOption ?? t(lang, 'customAnswer')}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <span className="text-xs text-slate-400 shrink-0">
                    {t(lang, 'questionOf')} {questionNumber} / {totalQuestions}
                </span>
            </div>

            <div>
                <h3 className="text-base font-medium text-white">
                    {question.question}
                </h3>
                {question.helperText && (
                    <p className="text-sm text-slate-400 mt-1">
                        {question.helperText}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {question.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelectOption(option)}
                        className={cn(
                            'w-full text-left rounded-lg border px-4 py-3 text-sm transition-all',
                            selectedOption === option
                                ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300'
                                : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800',
                        )}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {showCustom && <CustomAnswerInput onSubmit={handleCustomSubmit} lang={lang} />}

            {selectedOption && (
                <p className="text-xs text-slate-500 text-center">
                    {t(lang, 'clickNext')}
                </p>
            )}
        </div>
    )
}
