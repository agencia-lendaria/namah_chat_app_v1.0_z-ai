'use client'

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Plus,
  Menu,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface Conversation {
  id: string
  subject: string
  created_at: Date
  user_id: string
}

interface ChatInterfaceProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (message: string) => void
  onNewConversation: () => void
  isTyping?: boolean
}

export function ChatInterface({ 
  conversation, 
  messages, 
  onSendMessage, 
  onNewConversation,
  isTyping = false 
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim())
      setInputMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implementar lógica de gravação de áudio
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const formatSubject = (subject: string) => {
    return subject.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-background border-r transform transition-transform duration-300 ease-in-out",
        "lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Conversas</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={onNewConversation}
            className="w-full mb-4"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
          
          <div className="flex-1">
            <div className="space-y-2">
              {/* Lista de conversas - placeholder por enquanto */}
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {formatSubject(conversation.subject)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.created_at.toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="secondary">Ativa</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                Conversa sobre {formatSubject(conversation.subject)}
              </h1>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4" ref={scrollRef}>
            <div className="space-y-4 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={cn(
                      "text-xs mt-1",
                      message.role === 'user' 
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    )}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="pr-24"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRecording}
                  className={cn(
                    "h-8 w-8",
                    isRecording && "text-red-500 hover:text-red-600"
                  )}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="h-8 w-8"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}