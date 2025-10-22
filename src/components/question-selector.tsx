"use client"

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { BookOpen, Zap } from "lucide-react"

interface QuestionSelectorProps {
  onSelect: (type: "normal" | "scenario", mode: "study" | "exam") => void
  loading: boolean
}

export default function QuestionSelector({ onSelect, loading }: QuestionSelectorProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold gradient-text tracking-tight">
            CBAP Exam Prep
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose your question type and learning mode
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Normal Questions Card */}
          <Card className="card-hover relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary text-2xl">
                <BookOpen className="w-6 h-6" />
                Normal Questions
              </CardTitle>
              <CardDescription className="text-base">
                Standard multiple choice questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                Practice with straightforward questions to build your knowledge foundation.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => onSelect("normal", "study")}
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 button-glow text-lg py-6"
                >
                  Study Mode
                </Button>
                <Button
                  onClick={() => {
                    console.log("Normal Exam Mode clicked");
                    onSelect("normal", "exam");
                  }}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 hover:bg-primary/5 hover:text-foreground text-lg py-6 cursor-pointer"
                >
                  Exam Mode
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Questions Card */}
          <Card className="card-hover relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-accent text-2xl">
                <Zap className="w-6 h-6" />
                Scenario Questions
              </CardTitle>
              <CardDescription className="text-base">
                Real-world scenario-based questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                Challenge yourself with complex scenarios that test practical application.
              </p>
              <div className="flex gap-4">
                <Button
                  onClick={() => onSelect("scenario", "study")}
                  disabled={loading}
                  className="flex-1 bg-accent hover:bg-accent/90 button-glow text-lg py-6"
                >
                  Study Mode
                </Button>
                <Button
                  onClick={() => {
                    console.log("Scenario Exam Mode clicked");
                    onSelect("scenario", "exam");
                  }}
                  disabled={loading}
                  variant="outline"
                  className="flex-1 hover:bg-accent/5 hover:text-foreground text-lg py-6 cursor-pointer"
                >
                  Exam Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Description */}
        <div className="glass-effect rounded-2xl p-8 border border-primary/20 max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-primary">Study Mode</h3>
              <p className="text-muted-foreground">
                Learn at your own pace with detailed explanations
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-accent">Exam Mode</h3>
              <p className="text-muted-foreground">
                Test yourself under timed conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
