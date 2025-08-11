import { create } from 'zustand'

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

interface ChatState {
  // Estado atual
  currentConversation: Conversation | null
  currentTheme: string | null
  messages: Message[]
  conversations: Conversation[]
  conversationMessages: Record<string, Message[]> // Mensagens por conversa
  isTyping: boolean
  isDarkMode: boolean
  
  // Ações
  setCurrentConversation: (conversation: Conversation) => void
  setCurrentTheme: (theme: string) => void
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setMessages: (messages: Message[]) => void
  addConversation: (conversation: Conversation) => void
  setTyping: (isTyping: boolean) => void
  toggleDarkMode: () => void
  clearCurrentConversation: () => void
  generateUserId: () => string
  renameConversation: (conversationId: string, newSubject: string) => void
  switchToConversation: (conversationId: string) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Estado inicial
  currentConversation: null,
  currentTheme: null,
  messages: [],
  conversations: [],
  conversationMessages: {},
  isTyping: false,
  isDarkMode: false, // Será inicializado no cliente

  // Ações
  setCurrentConversation: (conversation) => {
    const state = get()
    const conversationMessages = state.conversationMessages[conversation.id] || []
    set({ 
      currentConversation: conversation, 
      currentTheme: conversation.subject,
      messages: conversationMessages
    })
  },

  setCurrentTheme: (theme) => {
    set({ currentTheme: theme })
  },

  addMessage: (message) => {
    const state = get()
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    const updatedMessages = [...state.messages, newMessage]
    const updatedConversationMessages = { ...state.conversationMessages }
    
    if (state.currentConversation) {
      updatedConversationMessages[state.currentConversation.id] = updatedMessages
    }
    
    set({
      messages: updatedMessages,
      conversationMessages: updatedConversationMessages
    })
  },

  setMessages: (messages) => {
    const state = get()
    const updatedConversationMessages = { ...state.conversationMessages }
    
    if (state.currentConversation) {
      updatedConversationMessages[state.currentConversation.id] = messages
    }
    
    set({ 
      messages,
      conversationMessages: updatedConversationMessages
    })
  },

  addConversation: (conversation) => {
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      conversationMessages: {
        ...state.conversationMessages,
        [conversation.id]: []
      }
    }))
  },

  setTyping: (isTyping) => {
    set({ isTyping })
  },

  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', newDarkMode.toString())
        if (newDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      return { isDarkMode: newDarkMode }
    })
  },

  clearCurrentConversation: () => {
    set({ currentConversation: null, messages: [] })
  },

  generateUserId: () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  renameConversation: (conversationId, newSubject) => {
    set((state) => ({
      conversations: state.conversations.map(conv =>
        conv.id === conversationId ? { ...conv, subject: newSubject } : conv
      ),
      currentConversation: state.currentConversation?.id === conversationId
        ? { ...state.currentConversation, subject: newSubject }
        : state.currentConversation
    }))
  },

  switchToConversation: (conversationId) => {
    const state = get()
    const conversation = state.conversations.find(conv => conv.id === conversationId)
    if (conversation) {
      const conversationMessages = state.conversationMessages[conversationId] || []
      set({
        currentConversation: conversation,
        messages: conversationMessages
      })
    }
  }
}))