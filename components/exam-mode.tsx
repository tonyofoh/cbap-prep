"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, RotateCcw } from "lucide-react"

interface Question {
  question: string
  options: string[] | Record<string, string>
  correct_answer: string
  explanation?: string
  bakok_explanation?: string
  bakok_reference?: string
  why_others_are_wrong?: Record<string, string>
}

interface Scenario {
  title: string
  description: string
  questions: Question[]
}

interface ExamModeProps {
  questions?: Question[]
  scenarios?: Scenario[]
  onBack: () => void
}

export default function ExamMode({ questions = [], scenarios = [], onBack }: ExamModeProps) {
  const isScenarioMode = scenarios.length > 0
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const currentScenario = isScenarioMode ? scenarios[currentScenarioIndex] : null
  const currentQuestions = isScenarioMode ? currentScenario?.questions || [] : questions
  const currentQuestion = currentQuestions[currentQuestionIndex]

  const isAnswered = answers[`${currentScenarioIndex}-${currentQuestionIndex}`] !== undefined

  const options = currentQuestion
    ? Array.isArray(currentQuestion.options)
      ? currentQuestion.options
      : Object.values(currentQuestion.options)
    : []

  // Initialize timer
  useEffect(() => {
    const totalQuestions = isScenarioMode ? scenarios.reduce((sum, s) => sum + s.questions.length, 0) : questions.length
    setTimeLeft(totalQuestions * 60)
  }, [isScenarioMode, scenarios, questions])

  // Timer effect
  useEffect(() => {
    if (isFinished || showResults || timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isFinished, showResults, timeLeft])

  const handleSelectAnswer = (answer: string) => {
    const key = isScenarioMode ? `${currentScenarioIndex}-${currentQuestionIndex}` : `${currentQuestionIndex}`
    setAnswers({ ...answers, [key]: answer })
  }

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (isScenarioMode && currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1)
      setCurrentQuestionIndex(0)
    } else {
      setIsFinished(true)
      setShowResults(true)
    }
  }

  const handleFinish = () => {
    setIsFinished(true)
    setShowResults(true)
  }

  const handleRestart = () => {
    setCurrentScenarioIndex(0)
    setCurrentQuestionIndex(0)
    setAnswers({})
    const totalQuestions = isScenarioMode ? scenarios.reduce((sum, s) => sum + s.questions.length, 0) : questions.length
    setTimeLeft(totalQuestions * 60)
    setIsFinished(false)
    setShowResults(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const calculateScore = () => {
    let correct = 0
    if (isScenarioMode) {
      scenarios.forEach((scenario, scenarioIdx) => {
        scenario.questions.forEach((q, qIdx) => {
          const key = `${scenarioIdx}-${qIdx}`
          if (answers[key] === q.correct_answer) {
            correct++
          }
        })
      })
    } else {
      questions.forEach((q, index) => {
        if (answers[`${index}`] === q.correct_answer) {
          correct++
        }
      })
    }
    return correct
  }

  const getTotalQuestions = () => {
    return isScenarioMode ? scenarios.reduce((sum, s) => sum + s.questions.length, 0) : questions.length
  }

  const score = calculateScore()
  const totalQuestions = getTotalQuestions()
  const percentage = Math.round((score / totalQuestions) * 100)

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Exam Complete!</h2>
          <div className="space-y-2">
            <div className="text-6xl font-bold text-primary">{percentage}%</div>
            <p className="text-xl text-muted-foreground">
              You scored {score} out of {totalQuestions} questions
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Results Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{score}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalQuestions - score}</p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-2xl font-bold text-accent">{totalQuestions}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-foreground">Question Review</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isScenarioMode
                  ? scenarios.map((scenario, scenarioIdx) =>
                      scenario.questions.map((q, qIdx) => {
                        const key = `${scenarioIdx}-${qIdx}`
                        const userAnswer = answers[key]
                        const isCorrect = userAnswer === q.correct_answer
                        return (
                          <div
                            key={key}
                            className={`p-3 rounded-lg border ${
                              isCorrect
                                ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold ${
                                  isCorrect ? "bg-green-600" : "bg-red-600"
                                }`}
                              >
                                {isCorrect ? "✓" : "✗"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground">{scenario.title}</p>
                                <p className="text-sm font-semibold text-foreground">
                                  Question {scenarioIdx * 10 + qIdx + 1}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{q.question}</p>
                                <p className="text-xs mt-1">
                                  <span className="font-semibold">Your answer:</span> {userAnswer}
                                </p>
                                {!isCorrect && (
                                  <p className="text-xs mt-1">
                                    <span className="font-semibold">Correct answer:</span> {q.correct_answer}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      }),
                    )
                  : questions.map((q, index) => {
                      const userAnswer = answers[`${index}`]
                      const isCorrect = userAnswer === q.correct_answer
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            isCorrect
                              ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                              : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-bold ${
                                isCorrect ? "bg-green-600" : "bg-red-600"
                              }`}
                            >
                              {isCorrect ? "✓" : "✗"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground">Question {index + 1}</p>
                              <p className="text-xs text-muted-foreground mt-1">{q.question}</p>
                              <p className="text-xs mt-1">
                                <span className="font-semibold">Your answer:</span> {userAnswer}
                              </p>
                              {!isCorrect && (
                                <p className="text-xs mt-1">
                                  <span className="font-semibold">Correct answer:</span> {q.correct_answer}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button onClick={handleRestart} className="gap-2 text-primary-foreground hover:opacity-90">
            <RotateCcw className="w-4 h-4" />
            Retake Exam
          </Button>
          <Button onClick={onBack} variant="outline" className="text-foreground hover:bg-secondary bg-transparent">
            Back to Selection
          </Button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  const totalQuestionNumber = isScenarioMode
    ? scenarios.slice(0, currentScenarioIndex).reduce((sum, s) => sum + s.questions.length, 0) +
      currentQuestionIndex +
      1
    : currentQuestionIndex + 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Exam Mode</h2>
          <p className="text-sm text-muted-foreground">
            Question {totalQuestionNumber} of {totalQuestions}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-2xl font-bold ${timeLeft < 60 ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
            {formatTime(timeLeft)}
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="text-foreground hover:bg-secondary bg-transparent border-border"
          >
            Exit Exam
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(totalQuestionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Scenario Card (if applicable) */}
      {isScenarioMode && currentScenario && (
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg text-accent">{currentScenario.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground text-sm leading-relaxed">{currentScenario.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Options */}
          <div className="space-y-3">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all cursor-pointer ${
                  answers[
                    isScenarioMode ? `${currentScenarioIndex}-${currentQuestionIndex}` : `${currentQuestionIndex}`
                  ] === option
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary hover:bg-accent/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      answers[
                        isScenarioMode ? `${currentScenarioIndex}-${currentQuestionIndex}` : `${currentQuestionIndex}`
                      ] === option
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {answers[
                      isScenarioMode ? `${currentScenarioIndex}-${currentQuestionIndex}` : `${currentQuestionIndex}`
                    ] === option && <span className="text-primary-foreground text-sm">✓</span>}
                  </div>
                  <span className="text-foreground">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <div className="flex gap-2 flex-wrap">
          {isScenarioMode
            ? scenarios.map((scenario, scenarioIdx) => (
                <div key={scenarioIdx} className="flex gap-1">
                  {scenario.questions.map((_, qIdx) => {
                    const key = `${scenarioIdx}-${qIdx}`
                    const isCurrentScenario = scenarioIdx === currentScenarioIndex
                    const isCurrentQuestion = isCurrentScenario && qIdx === currentQuestionIndex
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setCurrentScenarioIndex(scenarioIdx)
                          setCurrentQuestionIndex(qIdx)
                        }}
                        className={`w-8 h-8 rounded border transition-all text-xs font-semibold ${
                          isCurrentQuestion
                            ? "bg-primary text-primary-foreground border-primary"
                            : answers[key] !== undefined
                              ? "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300"
                              : "border-border hover:border-primary text-foreground"
                        }`}
                      >
                        {scenarioIdx * 10 + qIdx + 1}
                      </button>
                    )
                  })}
                </div>
              ))
            : questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded border transition-all text-xs font-semibold ${
                    index === currentQuestionIndex
                      ? "bg-primary text-primary-foreground border-primary"
                      : answers[`${index}`] !== undefined
                        ? "bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300"
                        : "border-border hover:border-primary text-foreground"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
        </div>

        <div className="flex gap-3">
          {totalQuestionNumber === totalQuestions ? (
            <Button onClick={handleFinish} className="gap-2 text-primary-foreground hover:opacity-90">
              Finish Exam
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="gap-2 text-primary-foreground hover:opacity-90">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
