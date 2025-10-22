import { useState, useEffect } from "react"
import { ThemeProvider } from "./components/theme-provider"
import ThemeToggle from "./components/theme-toggle"
import QuestionSelector from "./components/question-selector"
import StudyMode from "./components/study-mode"
import ExamMode from "./components/exam-mode"
import Footer from "./components/footer"

type Mode = "select" | "study" | "exam"
type QuestionType = "normal" | "scenario" | null

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

export default function App() {
  const [mode, setMode] = useState<Mode>("select")
  const [questionType, setQuestionType] = useState<QuestionType>(null)
  const [practiceMode, setPracticeMode] = useState<"study" | "exam">("study")
  const [questions, setQuestions] = useState<Question[]>([])
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadQuestions = async () => {
      if (!questionType) return

      setLoading(true)
      try {
        if (questionType === "scenario") {
          const response = await fetch("/data/scenario-questions.json")
          const scenarioData = await response.json()
          const transformedScenarios = scenarioData.map((scenario: any) => ({
            title: scenario.title,
            description: scenario.scenario,
            questions: scenario.questions.map((q: any) => ({
              question: q.question,
              options: q.options,
              correct_answer: q.correct_answer,
              babok_explanation: q.babok_explanation,
              babok_reference: q.babok_reference,
              why_others_are_wrong: q.why_others_are_wrong,
            })),
          }))
          setScenarios(transformedScenarios)
        } else {
          const response = await fetch("/data/normal-questions.json")
          const data = await response.json()
          setQuestions(data)
        }

        setMode(practiceMode)
      } catch (error) {
        console.error("Error loading questions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [questionType, practiceMode])

  const handleSelectType = (type: QuestionType, mode: "study" | "exam") => {
    setQuestionType(type)
    setPracticeMode(mode)
  }

  const handleBack = () => {
    setMode("select")
    setQuestionType(null)
    setQuestions([])
    setScenarios([])
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <ThemeToggle />

        <main className="flex-1 container mx-auto px-4 py-4 max-w-4xl flex flex-col">
          {mode === "select" && <QuestionSelector onSelect={handleSelectType} loading={loading} />}

          {mode === "study" && questionType === "scenario" && (
            <StudyMode scenarios={scenarios} onBack={handleBack} />
          )}

          {mode === "study" && questionType === "normal" && (
            <StudyMode questions={questions} onBack={handleBack} />
          )}

          {mode === "exam" && questionType === "scenario" && (
            <ExamMode scenarios={scenarios} onBack={handleBack} />
          )}

          {mode === "exam" && questionType === "normal" && (
            <ExamMode questions={questions} onBack={handleBack} />
          )}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}
