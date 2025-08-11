'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Brain, TrendingUp, Users } from "lucide-react"

interface ThemeSelectorProps {
  onThemeSelect: (theme: string) => void
}

const themes = [
  {
    id: "autoestima",
    title: "Autoestima",
    description: "Conversas sobre autoestima",
    icon: Heart,
    color: "text-rose-500"
  },
  {
    id: "inteligencia_emocional",
    title: "Inteligência Emocional",
    description: "Conversas sobre inteligência emocional",
    icon: Brain,
    color: "text-blue-500"
  },
  {
    id: "prosperidade",
    title: "Prosperidade",
    description: "Conversas sobre prosperidade",
    icon: TrendingUp,
    color: "text-green-500"
  },
  {
    id: "relacionamento",
    title: "Relacionamento",
    description: "Conversas sobre relacionamento",
    icon: Users,
    color: "text-purple-500"
  }
]

export function ThemeSelector({ onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Como posso te ajudar hoje?</h1>
        <p className="text-lg text-muted-foreground">Selecione um tema para começar a conversar</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {themes.map((theme) => {
          const IconComponent = theme.icon
          return (
            <Card 
              key={theme.id}
              className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/20"
              onClick={() => onThemeSelect(theme.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-2">
                  <IconComponent className={`h-12 w-12 ${theme.color}`} />
                </div>
                <CardTitle className="text-xl">{theme.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  {theme.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}