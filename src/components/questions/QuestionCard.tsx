import { useState } from 'react'
import type { Question } from '../../types'
import { CustomAnswerInput } from './CustomAnswerInput'
import { useGeneratorStore } from '../../stores/generatorStore'
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
    const [showCustom, setShowCustom] = useState(false)
    const answerQuestion = useGeneratorStore((s) => s.answerQuestion)
    const nextQuestion = useGeneratorStore((s) => s.nextQuestion)
    const isLast = useGeneratorStore((s) => s.isLastQuestion)

    const customAnswerLabel = lang === 'id' ? 'Jawaban custom' : 'Custom answer'

    const handleSelectOption = (option: string) => {
        if (option === customAnswerLabel) {
            setShowCustom(true)
            return
        }
        setShowCustom(false)
        answerQuestion(question.id, option)
        // Auto-advance to next question
        if (!isLast()) {
            nextQuestion()
        }
    }

    const handleCustomSubmit = (answer: string) => {
        answerQuestion(question.id, answer)
        if (!isLast()) {
            nextQuestion()
        }
    }

    const progressPercent = (questionNumber / totalQuestions) * 100

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
                        className="w-full text-left rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800"
                    >
                        {option}
                    </button>
                ))}
            </div>

            {showCustom && <CustomAnswerInput onSubmit={handleCustomSubmit} lang={lang} />}
        </div>
    )
}
