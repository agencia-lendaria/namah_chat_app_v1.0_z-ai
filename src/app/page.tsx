'use client'

import { useState } from 'react'
import { ThemeSelector } from '@/components/theme-selector'
import { ChatInterface } from '@/components/chat-interface'
import { useChatStore } from '@/store/chat-store'
import { toast } from '@/hooks/use-toast'

export default function Home() {
  const [currentView, setCurrentView] = useState<'theme' | 'chat'>('theme')
  const { 
    currentConversation, 
    messages, 
    setCurrentConversation, 
    addMessage, 
    addConversation,
    setTyping,
    clearCurrentConversation,
    generateUserId
  } = useChatStore()

  const handleThemeSelect = async (theme: string) => {
    try {
      const response = await fetch('/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject: theme })
      })

      if (!response.ok) {
        throw new Error('Failed to create conversation')
      }

      const data = await response.json()
      
      // Criar objeto de conversa
      const conversation = {
        id: data.conversation.id,
        subject: data.conversation.subject,
        created_at: new Date(data.conversation.created_at),
        user_id: data.userId
      }

      // Adicionar conversa ao store
      addConversation(conversation)
      setCurrentConversation(conversation)

      // Adicionar mensagem inicial do assistente
      addMessage({
        content: data.message,
        role: 'assistant'
      })

      // Mudar para a view de chat
      setCurrentView('chat')

    } catch (error) {
      console.error('Error creating conversation:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar a conversa. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!currentConversation) return

    // Adicionar mensagem do usuário
    addMessage({
      content: message,
      role: 'user'
    })

    // Mostrar indicador de digitação
    setTyping(true)

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: message,
          chatId: currentConversation.id,
          userId: currentConversation.user_id
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Adicionar resposta do assistente
      addMessage({
        content: data.output,
        role: 'assistant'
      })

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setTyping(false)
    }
  }

  const handleNewConversation = () => {
    clearCurrentConversation()
    setCurrentView('theme')
  }

  return (
    <div className="h-screen">
      {currentView === 'theme' && (
        <ThemeSelector onThemeSelect={handleThemeSelect} />
      )}
      
      {currentView === 'chat' && currentConversation && (
        <ChatInterface
          conversation={currentConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          onNewConversation={handleNewConversation}
          isTyping={useChatStore.getState().isTyping}
        />
      )}
    </div>
  )
}