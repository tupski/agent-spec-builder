import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useGeneratorStore } from '../../stores/generatorStore'
import { QuestionCard } from './QuestionCard'
import { Button } from '../ui/Button'

export function QuestionFlow() {
    const questions = useGeneratorStore((s) => s.questions)
    const currentQuestionIndex = useGeneratorStore((s) => s.currentQuestionIndex)
    const answers = useGeneratorStore((s) => s.answers)
    const goToNextQuestion = useGeneratorStore((s) => s.goToNextQuestion)
    const goToPrevQuestion = useGeneratorStore((s) => s.goToPrevQuestion)
    const isLastQuestion = useGeneratorStore((s) => s.isLastQuestion)
    const setGenerationPhase = useGeneratorStore((s) => s.setGenerationPhase)

    if (questions.length === 0) return null

    const currentQuestion = questions[currentQuestionIndex]
    const currentAnswered = answers[currentQuestion.id] !== undefined
    const allAnswered = questions.every((q) => answers[q.id] !== undefined)

    const handleFinish = () => {
        if (allAnswered) {
            setGenerationPhase('generating')
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-6">
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-slate-400">
                        Clarifying Questions
                    </h2>
                    {allAnswered && (
                        <span className="text-xs text-emerald-400">
                            ✓ Semua terjawab
                        </span>
                    )}
                </div>

                <QuestionCard
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                />

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToPrevQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    {isLastQuestion() ? (
                        <Button
                            size="sm"
                            onClick={handleFinish}
                            disabled={!allAnswered}
                        >
                            {allAnswered
                                ? 'Generate Documents'
                                : 'Jawab semua pertanyaan dulu'}
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={goToNextQuestion}
                            disabled={!currentAnswered}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {Object.keys(answers).length > 0 && (
                    <details className="mt-4">
                        <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-300">
                            Lihat jawaban ({Object.keys(answers).length}/{questions.length})
                        </summary>
                        <div className="mt-2 space-y-1">
                            {questions.map((q) => (
                                <div key={q.id} className="text-xs text-slate-400">
                                    <span className="text-slate-500">
                                        {q.question.slice(0, 50)}...
                                    </span>
                                    <span className="text-slate-300 ml-2">
                                        {answers[q.id] ? '✓' : '—'}
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
