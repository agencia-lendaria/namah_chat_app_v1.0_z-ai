'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/store/chat-store'

export function ThemeInitializer() {
  const toggleDarkMode = useChatStore((state) => state.toggleDarkMode)
  const isDarkMode = useChatStore((state) => state.isDarkMode)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true'
      
      // Se há um tema salvo diferente do atual, atualiza
      if (savedDarkMode && !isDarkMode) {
        toggleDarkMode()
      }
      
      // Aplica o tema inicial ao DOM
      if (savedDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, []) // Executa apenas uma vez

  return null // Este componente não renderiza nada
}