"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

interface StudyModeProps {
  questions?: Question[]
  scenarios?: Scenario[]
  onBack: () => void
}

export default function StudyMode({ questions = [], scenarios = [], onBack }: StudyModeProps) {
  const isScenarioMode = scenarios.length > 0
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  const currentScenario = isScenarioMode ? scenarios[currentScenarioIndex] : null
  const currentQuestions = isScenarioMode ? currentScenario?.questions || [] : questions
  const currentQuestion = currentQuestions[currentQuestionIndex]

  const isAnswered = selectedAnswer !== null
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer

  const options = currentQuestion
    ? Array.isArray(currentQuestion.options)
      ? currentQuestion.options
      : Object.values(currentQuestion.options)
    : []

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else if (isScenarioMode && currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1)
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else if (isScenarioMode && currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1)
      const prevScenario = scenarios[currentScenarioIndex - 1]
      setCurrentQuestionIndex(prevScenario.questions.length - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowExplanation(true)
  }

  const totalQuestions = isScenarioMode ? scenarios.reduce((sum, s) => sum + s.questions.length, 0) : questions.length

  const currentQuestionNumber = isScenarioMode
    ? scenarios.slice(0, currentScenarioIndex).reduce((sum, s) => sum + s.questions.length, 0) +
      currentQuestionIndex +
      1
    : currentQuestionIndex + 1

  const isLastQuestion =
    currentQuestionIndex === currentQuestions.length - 1 &&
    (!isScenarioMode || currentScenarioIndex === scenarios.length - 1)

  if (!currentQuestion) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Study Mode</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestionNumber} of {totalQuestions}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onBack}
            variant="outline"
            className="text-foreground hover:bg-secondary bg-transparent border-border"
          >
            Exit Quiz
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
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
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === option
                    ? isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-border hover:border-primary hover:bg-accent/5"
                } ${isAnswered ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedAnswer === option
                        ? isCorrect
                          ? "border-green-500 bg-green-500"
                          : "border-red-500 bg-red-500"
                        : "border-border"
                    }`}
                  >
                    {selectedAnswer === option && <span className="text-white text-sm">✓</span>}
                  </div>
                  <span className="text-foreground">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`p-4 rounded-lg border-l-4 ${
                isCorrect
                  ? "bg-green-50 dark:bg-green-950 border-green-500"
                  : "bg-red-50 dark:bg-red-950 border-red-500"
              }`}
            >
              <p
                className={`font-semibold mb-2 ${isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>

              {currentQuestion.explanation && (
                <div className="space-y-2 mb-3">
                  <p className="text-sm text-foreground">{currentQuestion.explanation}</p>
                </div>
              )}

              {!isCorrect && currentQuestion.why_others_are_wrong && (
                <div className="space-y-2 mb-3">
                  <p className="text-sm font-semibold text-foreground">Why others are wrong:</p>
                  <ul className="text-sm space-y-1">
                    {Object.entries(currentQuestion.why_others_are_wrong).map(([option, reason]) => (
                      <li key={option} className="text-foreground">
                        <strong>{option}:</strong> {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {currentQuestion.bakok_explanation && (
                <div className="space-y-2 mb-3">
                  <p className="text-sm font-semibold text-foreground">Background:</p>
                  <p className="text-sm text-foreground">{currentQuestion.bakok_explanation}</p>
                </div>
              )}

              {currentQuestion.bakok_reference && (
                <p className="text-xs text-muted-foreground">Reference: {currentQuestion.bakok_reference}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3 justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestionNumber === 1}
          variant="outline"
          className="gap-2 text-foreground hover:bg-secondary bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-2 flex-wrap justify-center">
          {isScenarioMode
            ? scenarios.map((scenario, scenarioIdx) => (
                <div key={scenarioIdx} className="flex gap-1">
                  {scenario.questions.map((_, qIdx) => {
                    const isCurrentScenario = scenarioIdx === currentScenarioIndex
                    const isCurrentQuestion = isCurrentScenario && qIdx === currentQuestionIndex
                    return (
                      <button
                        key={`${scenarioIdx}-${qIdx}`}
                        onClick={() => {
                          setCurrentScenarioIndex(scenarioIdx)
                          setCurrentQuestionIndex(qIdx)
                          setSelectedAnswer(null)
                          setShowExplanation(false)
                        }}
                        className={`w-8 h-8 rounded border transition-all text-xs font-semibold ${
                          isCurrentQuestion
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary text-foreground"
                        }`}
                      >
                        {scenarioIdx * 10 + qIdx + 1}
                      </button>
                    )
                  })}
                </div>
              ))
            : Array.from({ length: Math.min(5, questions.length) }).map((_, i) => {
                const pageStart = Math.max(0, currentQuestionIndex - 2)
                const questionIndex = pageStart + i
                if (questionIndex >= questions.length) return null

                return (
                  <button
                    key={questionIndex}
                    onClick={() => {
                      setCurrentQuestionIndex(questionIndex)
                      setSelectedAnswer(null)
                      setShowExplanation(false)
                    }}
                    className={`w-8 h-8 rounded border transition-all text-xs font-semibold ${
                      questionIndex === currentQuestionIndex
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:border-primary text-foreground"
                    }`}
                  >
                    {questionIndex + 1}
                  </button>
                )
              })}
        </div>

        <Button
          onClick={handleNext}
          disabled={isLastQuestion}
          className="gap-2 text-primary-foreground hover:opacity-90"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
