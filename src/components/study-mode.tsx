"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface Question {
  question: string
  options: string[] | Record<string, string>
  correct_answer: string
  explanation?: string
  babok_explanation?: string
  babok_reference?: string
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
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [showAnswer, setShowAnswer] = useState(false)
  const [viewFormat, setViewFormat] = useState<"one-by-one" | "list">("one-by-one")
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set())

  const isScenarioMode = scenarios.length > 0
  const currentScenario = isScenarioMode ? scenarios[currentScenarioIndex] : null
  const scenarioQuestions = currentScenario?.questions || []
  const allQuestions = isScenarioMode ? scenarioQuestions : questions

  if (viewFormat === "list") {
    const handleRevealAnswer = (questionIndex: number) => {
      const questionKey = `${currentScenarioIndex}-${questionIndex}`
      if (revealedAnswers.has(questionKey)) {
        // If answer is already revealed, hide it
        const newRevealedAnswers = new Set(revealedAnswers)
        newRevealedAnswers.delete(questionKey)
        setRevealedAnswers(newRevealedAnswers)
      } else {
        // If answer is hidden, reveal it
        setRevealedAnswers(new Set([...revealedAnswers, questionKey]))
      }
    }

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Study Mode - List View</h2>
          <div className="flex gap-2">
            <Button onClick={() => setViewFormat("one-by-one")} variant="outline" size="sm">
              One by One
            </Button>
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

        <div className="space-y-4">
          {allQuestions.map((question, index) => {
            const questionKey = `${currentScenarioIndex}-${index}`
            const isRevealed = revealedAnswers.has(questionKey)
            const selectedAnswer = selectedAnswers[questionKey]
            const isCorrect = selectedAnswer === question.correct_answer
            const options = Array.isArray(question.options)
              ? question.options
              : Object.entries(question.options).map(([key, value]) => ({ key, value: `${key}. ${value}` }))
            
            const handleSelectAnswer = (answer: string) => {
              setSelectedAnswers({
                ...selectedAnswers,
                [questionKey]: answer,
              })
            }
            
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">Question {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-medium">{question.question}</p>

                  <div className="space-y-2">
                    {(Array.isArray(question.options)
                      ? question.options
                      : Object.entries(question.options).map(([key, value]) => `${key}. ${value}`)
                    ).map((option, optIdx) => {
                      const optionKey = Array.isArray(question.options)
                        ? option
                        : Object.keys(question.options)[optIdx]
                      const isSelected = selectedAnswer === optionKey
                      const isCorrectOption = optionKey === question.correct_answer
                      
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(optionKey)}
                          className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-foreground"
                              : isRevealed && isCorrectOption
                                ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100"
                                : "border-border hover:border-primary text-foreground"
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  <Button 
                    onClick={() => handleRevealAnswer(index)}
                    variant="outline" 
                    className={`w-full transition-all hover:text-foreground ${
                      isRevealed 
                        ? "bg-primary/10 hover:bg-primary/20 text-primary border-primary" 
                        : "bg-transparent hover:bg-primary/10 text-foreground"
                    }`}
                  >
                    {isRevealed ? "Hide Answer" : "Reveal Answer"}
                  </Button>

                  {isRevealed && selectedAnswer && (
                    <div
                      className={`p-4 rounded-lg ${
                        isCorrect 
                          ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800" 
                          : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                      }`}
                    >
                      <p
                        className={`font-semibold mb-2 ${
                          isCorrect 
                            ? "text-green-700 dark:text-green-300" 
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm mb-3 text-red-900 dark:text-red-100">
                          <strong>Correct Answer:</strong> {question.correct_answer}
                        </p>
                      )}
                      <div className="space-y-3">
                        {question.babok_explanation && (
                          <div>
                            <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-green-900 dark:text-green-100">
                              {question.babok_explanation}
                            </p>
                          </div>
                        )}
                        
                        {question.why_others_are_wrong && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Why other options are incorrect:
                            </p>
                            <div className="space-y-2">
                              {Object.entries(question.why_others_are_wrong).map(([option, explanation]) => (
                                <div key={option} className="text-sm text-gray-600 dark:text-gray-400 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{option}:</span> {explanation}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {question.babok_reference && (
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Reference:</strong> {question.babok_reference}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {isRevealed && !selectedAnswer && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Answer</p>
                      <p className="text-sm mb-2 text-blue-900 dark:text-blue-100">
                        <strong>Correct Answer:</strong> {question.correct_answer}
                      </p>
                      <div className="space-y-3">
                        {question.babok_explanation && (
                          <div>
                            <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                              {question.babok_explanation}
                            </p>
                          </div>
                        )}
                        
                        {question.why_others_are_wrong && (
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Why other options are incorrect:
                            </p>
                            <div className="space-y-2">
                              {Object.entries(question.why_others_are_wrong).map(([option, explanation]) => (
                                <div key={option} className="text-sm text-gray-600 dark:text-gray-400 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
                                  <span className="font-medium text-gray-800 dark:text-gray-200">{option}:</span> {explanation}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {question.babok_reference && (
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <strong>Reference:</strong> {question.babok_reference}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Back to Top Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={scrollToTop}
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background hover:text-foreground border-border/50 hover:border-border shadow-lg hover:shadow-xl transition-all duration-200"
            aria-label="Back to top"
          >
            <ChevronLeft className="w-4 h-4 rotate-90" />
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = allQuestions[currentQuestionIndex]

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No questions available</p>
      </div>
    )
  }

  const questionKey = `${currentScenarioIndex}-${currentQuestionIndex}`
  const selectedAnswer = selectedAnswers[questionKey]
  const isCorrect = selectedAnswer === currentQuestion.correct_answer
  const options = Array.isArray(currentQuestion.options)
    ? currentQuestion.options
    : Object.entries(currentQuestion.options).map(([key, value]) => ({ key, value: `${key}. ${value}` }))

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
        setShowAnswer(false)
      } else if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(currentScenarioIndex + 1)
        setCurrentQuestionIndex(0)
        setShowAnswer(false)
      }
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setShowAnswer(false)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowAnswer(false)
    } else if (isScenarioMode && currentScenarioIndex > 0) {
      setCurrentScenarioIndex(currentScenarioIndex - 1)
      setCurrentQuestionIndex(scenarioQuestions.length - 1)
      setShowAnswer(false)
    }
  }

  const totalQuestions = isScenarioMode ? scenarios.reduce((sum, s) => sum + s.questions.length, 0) : questions.length

  const currentQuestionNumber = isScenarioMode
    ? scenarios.slice(0, currentScenarioIndex).reduce((sum, s) => sum + s.questions.length, 0) +
      currentQuestionIndex +
      1
    : currentQuestionIndex + 1

  const handleRevealAnswer = () => {
    if (revealedAnswers.has(questionKey)) {
      // If answer is already revealed, hide it
      const newRevealedAnswers = new Set(revealedAnswers)
      newRevealedAnswers.delete(questionKey)
      setRevealedAnswers(newRevealedAnswers)
    } else {
      // If answer is hidden, reveal it
      setRevealedAnswers(new Set([...revealedAnswers, questionKey]))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Study Mode</h2>
        <div className="flex gap-2">
          <Button onClick={() => setViewFormat("list")} variant="outline" size="sm">
            List View
          </Button>
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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                Question {currentQuestionNumber} of {totalQuestions}
              </CardTitle>
              <CardDescription>Select your answer to check</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base font-medium">{currentQuestion.question}</p>

          <div className="space-y-3">
            {(Array.isArray(currentQuestion.options)
              ? currentQuestion.options
              : Object.entries(currentQuestion.options).map(([key, value]) => `${key}. ${value}`)
            ).map((option, index) => {
              const optionKey = Array.isArray(currentQuestion.options)
                ? option
                : Object.keys(currentQuestion.options)[index]
              const isSelected = selectedAnswer === optionKey
              const isCorrectOption = optionKey === currentQuestion.correct_answer
              const isRevealed = revealedAnswers.has(questionKey)

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(optionKey)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : (showAnswer || isRevealed) && isCorrectOption
                        ? "border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100"
                        : "border-border hover:border-primary text-foreground"
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {selectedAnswer && (showAnswer || revealedAnswers.has(questionKey)) && (
            <div
              className={`p-4 rounded-lg ${isCorrect ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"}`}
            >
              <p
                className={`font-semibold mb-2 ${isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}
              >
                {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              {!isCorrect && (
                <p className="text-sm mb-3 text-red-900 dark:text-red-100">
                  <strong>Correct Answer:</strong> {currentQuestion.correct_answer}
                </p>
              )}
              <div className="space-y-3">
                {currentQuestion.babok_explanation && (
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                      Explanation:
                    </p>
                    <p className="text-sm text-green-900 dark:text-green-100">
                      {currentQuestion.babok_explanation}
                    </p>
                  </div>
                )}
                
                {currentQuestion.why_others_are_wrong && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Why other options are incorrect:
                    </p>
                    <div className="space-y-2">
                      {Object.entries(currentQuestion.why_others_are_wrong).map(([option, explanation]) => (
                        <div key={option} className="text-sm text-gray-600 dark:text-gray-400 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
                          <span className="font-medium text-gray-800 dark:text-gray-200">{option}:</span> {explanation}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {currentQuestion.babok_reference && (
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Reference:</strong> {currentQuestion.babok_reference}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button 
            onClick={handleRevealAnswer} 
            variant="outline" 
            className={`w-full transition-all hover:text-foreground ${
              revealedAnswers.has(questionKey) 
                ? "bg-primary/10 hover:bg-primary/20 text-primary border-primary" 
                : "bg-transparent hover:bg-primary/10 text-foreground"
            }`}
          >
            {revealedAnswers.has(questionKey) ? "Hide Answer" : "Reveal Answer"}
          </Button>

          {(showAnswer || revealedAnswers.has(questionKey)) && !selectedAnswer && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Answer</p>
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                <strong>Correct Answer:</strong> {currentQuestion.correct_answer}
              </p>
              {currentQuestion.babok_explanation && (
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>BABOK:</strong> {currentQuestion.babok_explanation}
                </p>
              )}
              {currentQuestion.babok_reference && (
                <p className="text-sm mt-2 text-blue-900 dark:text-blue-100">
                  <strong>Reference:</strong> {currentQuestion.babok_reference}
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-between pt-4 border-t">
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
            <Button
              onClick={handleNext}
              disabled={
                currentQuestionIndex === allQuestions.length - 1 && currentScenarioIndex === scenarios.length - 1
              }
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
