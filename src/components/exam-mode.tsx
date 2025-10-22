"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

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
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(60)
  const [showResults, setShowResults] = useState(false)

  const isScenarioMode = scenarios.length > 0
  const currentScenario = isScenarioMode ? scenarios[currentScenarioIndex] : null
  const scenarioQuestions = currentScenario?.questions || []
  const allQuestions = isScenarioMode ? scenarioQuestions : questions

  const totalQuestions = isScenarioMode ? scenarios.reduce((sum, s) => sum + s.questions.length, 0) : questions.length

  const currentQuestionNumber = isScenarioMode
    ? scenarios.slice(0, currentScenarioIndex).reduce((sum, s) => sum + s.questions.length, 0) +
      currentQuestionIndex +
      1
    : currentQuestionIndex + 1

  const currentQuestion = allQuestions[currentQuestionIndex]

  useEffect(() => {
    if (showResults) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext()
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, currentScenarioIndex, showResults])

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No questions available</p>
      </div>
    )
  }

  const questionKey = `${currentScenarioIndex}-${currentQuestionIndex}`
  const selectedAnswer = selectedAnswers[questionKey]
  const options = Array.isArray(currentQuestion.options)
    ? currentQuestion.options
    : Object.entries(currentQuestion.options).map(([key, value]) => `${key}. ${value}`)

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionKey]: answer,
    })
  }

  const handleNext = () => {
    if (isScenarioMode) {
      if (currentQuestionIndex < scenarioQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setTimeLeft(60)
      } else if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(currentScenarioIndex + 1)
        setCurrentQuestionIndex(0)
        setTimeLeft(60)
      } else {
        setShowResults(true)
      }
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setTimeLeft(60)
      } else {
        setShowResults(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setTimeLeft(60)
    } else if (isScenarioMode && currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1)
      setCurrentQuestionIndex(scenarioQuestions.length - 1)
      setTimeLeft(60)
    }
  }

  const handleFinish = () => {
    setShowResults(true)
  }

  if (showResults) {
    const correctCount = Object.entries(selectedAnswers).filter(([key, answer]) => {
      const [scenarioIdx, questionIdx] = key.split("-").map(Number)
      const q = isScenarioMode ? scenarios[scenarioIdx]?.questions[questionIdx] : questions[questionIdx]
      return q && answer === q.correct_answer
    }).length

    const score = Math.round((correctCount / totalQuestions) * 100)

    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center bg-card/50 p-6 rounded-2xl border backdrop-blur-sm">
            <h2 className="text-3xl font-bold gradient-text">Exam Results</h2>
            <Button 
              onClick={onBack} 
              variant="ghost" 
              size="icon" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Score Card */}
          <Card className="card-hover bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
            <CardHeader className="text-center space-y-6">
              <div className="relative inline-block">
                <svg className="w-48 h-48">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="70"
                    cx="96"
                    cy="96"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="70"
                    cx="96"
                    cy="96"
                    style={{
                      strokeDasharray: 440,
                      strokeDashoffset: 440 - (440 * score) / 100,
                      transform: "rotate(-90deg)",
                      transformOrigin: "50% 50%",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-primary">{score}%</span>
                </div>
              </div>
              <CardDescription className="text-xl text-foreground">
                {correctCount} out of {totalQuestions} correct
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Questions Review */}
          <div className="space-y-6">
            {Object.entries(selectedAnswers).map(([key, answer]) => {
              const [scenarioIdx, questionIdx] = key.split("-").map(Number)
              const q = isScenarioMode ? scenarios[scenarioIdx]?.questions[questionIdx] : questions[questionIdx]

              if (!q) return null

              const isCorrect = answer === q.correct_answer
              const qNum = isScenarioMode
                ? scenarios.slice(0, scenarioIdx).reduce((sum, s) => sum + s.questions.length, 0) + questionIdx + 1
                : questionIdx + 1

              return (
                <Card
                  key={key}
                  className={`card-hover ${
                    isCorrect 
                      ? "bg-green-50/50 dark:bg-green-950/50 border-green-200 dark:border-green-800" 
                      : "bg-red-50/50 dark:bg-red-950/50 border-red-200 dark:border-red-800"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      {isCorrect ? (
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900">
                          <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900">
                          <span className="text-red-600 dark:text-red-400 text-xl">✗</span>
                        </span>
                      )}
                      Question {qNum}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg font-medium text-foreground">{q.question}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-base">
                        <span className="text-muted-foreground">Your answer:</span>
                        <span
                          className={
                            isCorrect
                              ? "text-green-600 dark:text-green-400 font-semibold"
                              : "text-red-600 dark:text-red-400 font-semibold"
                          }
                        >
                          {answer}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-center gap-2 text-base">
                          <span className="text-muted-foreground">Correct answer:</span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            {q.correct_answer}
                          </span>
                        </div>
                      )}
                    </div>
                    {q.explanation && (
                      <div className="bg-background/50 p-4 rounded-lg border">
                        <p className="text-base text-foreground">{q.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Button 
            onClick={onBack} 
            className="w-full py-6 text-lg bg-primary hover:bg-primary/90"
          >
            Back to Menu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Exam Mode</h2>
        <div className="flex items-center gap-4">
          <div
            className={`text-2xl font-bold px-4 py-2 rounded-lg ${timeLeft <= 10 ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950" : "text-primary bg-primary/10"}`}
          >
            {timeLeft}s
          </div>
          <Button onClick={onBack} variant="ghost" size="icon" className="text-destructive hover:text-destructive">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {isScenarioMode && currentScenario && (
        <Card className="bg-gradient-to-r from-accent/20 to-secondary/20 border-accent/30">
          <CardHeader>
            <CardTitle className="text-lg text-accent">{currentScenario.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{currentScenario.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            Question {currentQuestionNumber} of {totalQuestions}
          </CardTitle>
          <CardDescription>Select your answer (answers revealed at the end)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base font-medium text-foreground">{currentQuestion.question}</p>

          <div className="space-y-3">
            {options.map((option, index) => {
              const optionKey = Array.isArray(currentQuestion.options)
                ? option
                : Object.keys(currentQuestion.options)[index]
              const isSelected = selectedAnswer === optionKey

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(optionKey)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all text-foreground ${
                    isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary"
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          <div className="flex gap-3 justify-between pt-4">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestionIndex === 0 && currentScenarioIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="flex-1 flex justify-center items-center text-sm text-muted-foreground">
              {currentQuestionNumber} / {totalQuestions}
            </div>
            {currentQuestionNumber === totalQuestions ? (
              <Button onClick={handleFinish} className="flex-1">
                Finish Exam
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
