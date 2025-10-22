"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Zap } from "lucide-react"

interface QuestionSelectorProps {
  onSelect: (type: "normal" | "scenario", mode: "study" | "exam") => void
  loading: boolean
}

export default function QuestionSelector({ onSelect, loading }: QuestionSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Quiz Master</h1>
        <p className="text-lg text-muted-foreground">Choose your question type and learning mode</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Normal Questions Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Normal Questions
            </CardTitle>
            <CardDescription>Standard multiple choice questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Practice with straightforward questions to build your knowledge foundation.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => onSelect("normal", "study")}
                disabled={loading}
                className="flex-1"
                variant="default"
              >
                Study Mode
              </Button>
              <Button
                onClick={() => onSelect("normal", "exam")}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                Exam Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scenario Questions Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Scenario Questions
            </CardTitle>
            <CardDescription>Real-world scenario-based questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Challenge yourself with complex scenarios that test practical application.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => onSelect("scenario", "study")}
                disabled={loading}
                className="flex-1"
                variant="default"
              >
                Study Mode
              </Button>
              <Button
                onClick={() => onSelect("scenario", "exam")}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                Exam Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-accent/10 border border-accent rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">
          <strong>Study Mode:</strong> Learn at your own pace with detailed explanations.
          <br />
          <strong>Exam Mode:</strong> Test yourself under timed conditions.
        </p>
      </div>
    </div>
  )
}
