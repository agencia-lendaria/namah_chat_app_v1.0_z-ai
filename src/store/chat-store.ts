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
  messages: Message[]
  conversations: Conversation[]
  isTyping: boolean
  
  // Ações
  setCurrentConversation: (conversation: Conversation) => void
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setMessages: (messages: Message[]) => void
  addConversation: (conversation: Conversation) => void
  setTyping: (isTyping: boolean) => void
  clearCurrentConversation: () => void
  generateUserId: () => string
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Estado inicial
  currentConversation: null,
  messages: [],
  conversations: [],
  isTyping: false,

  // Ações
  setCurrentConversation: (conversation) => {
    set({ currentConversation: conversation, messages: [] })
  },

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    set((state) => ({
      messages: [...state.messages, newMessage]
    }))
  },

  setMessages: (messages) => {
    set({ messages })
  },

  addConversation: (conversation) => {
    set((state) => ({
      conversations: [conversation, ...state.conversations]
    }))
  },

  setTyping: (isTyping) => {
    set({ isTyping })
  },

  clearCurrentConversation: () => {
    set({ currentConversation: null, messages: [] })
  },

  generateUserId: () => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}))