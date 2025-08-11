'use client'

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Plus,
  Menu,
  X,
  Edit3,
  Check,
  Trash2,
  RotateCcw,
  Sun,
  Moon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/store/chat-store"
import { useTheme } from "@/hooks/use-theme"

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
  conversation: Conversation | null
  messages: Message[]
  conversations: Conversation[]
  onSendMessage: (message: string) => void
  onNewConversation: () => void
  onNewTheme: () => void
  onSwitchConversation: (conversationId: string) => void
  onRenameConversation: (conversationId: string, newSubject: string) => void
  isTyping?: boolean
}

export function ChatInterface({ 
  conversation, 
  messages, 
  conversations,
  onSendMessage, 
  onNewConversation,
  onNewTheme,
  onSwitchConversation,
  onRenameConversation,
  isTyping = false 
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [editingConversation, setEditingConversation] = useState<string | null>(null)
  const [editingSubject, setEditingSubject] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const isDarkMode = useChatStore((state) => state.isDarkMode)
  const toggleDarkMode = useChatStore((state) => state.toggleDarkMode)
  
  useTheme()

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

  const startEditing = (conv: Conversation) => {
    setEditingConversation(conv.id)
    setEditingSubject(formatSubject(conv.subject))
  }

  const cancelEditing = () => {
    setEditingConversation(null)
    setEditingSubject("")
  }

  const saveEditing = (conversationId: string) => {
    if (editingSubject.trim()) {
      // Converter de volta para o formato com underscore
      const newSubject = editingSubject.trim().toLowerCase().replace(/\s+/g, '_')
      onRenameConversation(conversationId, newSubject)
      setEditingConversation(null)
      setEditingSubject("")
    }
  }

  const handleEditKeyPress = (e: React.KeyboardEvent, conversationId: string) => {
    if (e.key === 'Enter') {
      saveEditing(conversationId)
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
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
          
          <div className="space-y-2 mb-4">
            <Button 
              onClick={onNewConversation}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Conversa
            </Button>
            
            <Button 
              onClick={onNewTheme}
              className="w-full"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Novo Tema
            </Button>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div 
                  key={conv.id}
                  className={cn(
                    "p-3 rounded-lg border cursor-pointer transition-colors",
                    conv.id === conversation?.id 
                      ? "bg-primary/10 border-primary/20" 
                      : "bg-muted/50 border-border hover:bg-muted"
                  )}
                  onClick={() => onSwitchConversation(conv.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingConversation === conv.id ? (
                        <Input
                          value={editingSubject}
                          onChange={(e) => setEditingSubject(e.target.value)}
                          onKeyPress={(e) => handleEditKeyPress(e, conv.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm h-8 mb-1"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-sm truncate">
                          {formatSubject(conv.subject)}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {conv.created_at.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {conv.id === conversation?.id && (
                        <Badge variant="secondary" className="text-xs">
                          Ativa
                        </Badge>
                      )}
                      {editingConversation === conv.id ? (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              saveEditing(conv.id)
                            }}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              cancelEditing()
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(conv)
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {conversations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma conversa ainda.
                  <br />
                  Clique em "Nova Conversa" para começar.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
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
                  {conversation ? `Conversa sobre ${formatSubject(conversation.subject)}` : "Selecione uma conversa"}
                </h1>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-8 w-8"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          {conversation ? (
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
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h2 className="text-xl font-semibold mb-2">Nenhuma conversa selecionada</h2>
                <p className="text-sm">Selecione uma conversa da barra lateral ou crie uma nova.</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={conversation ? "Digite sua mensagem..." : "Selecione uma conversa para enviar mensagens"}
                className="pr-24 min-h-[80px] resize-none"
                disabled={!conversation}
                rows={3}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRecording}
                  disabled={!conversation}
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
                  disabled={!conversation || !inputMessage.trim()}
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