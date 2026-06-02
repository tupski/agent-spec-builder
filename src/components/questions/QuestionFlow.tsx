import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGeneratorStore } from '../../stores/generatorStore'
import { QuestionCard } from './QuestionCard'
import { Button } from '../ui/Button'
import { t, type Lang } from '../../lib/i18n/translations'

type Props = {
    lang: Lang
}

export function QuestionFlow({ lang }: Props) {
    const questions = useGeneratorStore((s) => s.aiQuestions)
    const currentQuestionIndex = useGeneratorStore((s) => s.currentQuestionIndex)
    const questionAnswers = useGeneratorStore((s) => s.questionAnswers)
    const nextQuestion = useGeneratorStore((s) => s.nextQuestion)
    const prevQuestion = useGeneratorStore((s) => s.prevQuestion)
    const isLastQuestion = useGeneratorStore((s) => s.isLastQuestion)
    const continueGeneration = useGeneratorStore((s) => s.continueGeneration)
    const isGenerating = useGeneratorStore((s) => s.isGenerating)

    if (questions.length === 0) return null

    const currentQuestion = questions[currentQuestionIndex]
    const currentAnswered = questionAnswers[currentQuestion.id] !== undefined
    const allAnswered = questions.every((q) => questionAnswers[q.id] !== undefined)

    const handleFinish = () => {
        if (allAnswered) {
            continueGeneration()
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-6">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-slate-400">
                        {t(lang, 'questionOf')}
                    </h2>
                    {allAnswered && (
                        <span className="text-xs text-emerald-400">
                            ✓ {Object.keys(questionAnswers).length}/{questions.length}
                        </span>
                    )}
                </div>

                <QuestionCard
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    lang={lang}
                />

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        {t(lang, 'previous')}
                    </Button>

                    {isLastQuestion() ? (
                        <Button
                            size="sm"
                            onClick={handleFinish}
                            disabled={!allAnswered || isGenerating}
                        >
                            {isGenerating
                                ? t(lang, 'generating')
                                : allAnswered
                                    ? t(lang, 'generateDocs')
                                    : t(lang, 'answerAll')}
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={nextQuestion}
                            disabled={!currentAnswered}
                        >
                            {t(lang, 'next')}
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {Object.keys(questionAnswers).length > 0 && (
                    <details className="mt-4">
                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300">
                            {t(lang, 'seeAnswers')} ({Object.keys(questionAnswers).length}/{questions.length})
                        </summary>
                        <div className="mt-2 space-y-1">
                            {questions.map((q) => (
                                <div key={q.id} className="text-xs text-slate-400">
                                    <span className="text-slate-500">
                                        {q.question.slice(0, 50)}...
                                    </span>
                                    <span className="text-slate-300 ml-2">
                                        {questionAnswers[q.id] ? '✓' : '—'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </details>
                )}
            </div>
        </div>
    )
}
