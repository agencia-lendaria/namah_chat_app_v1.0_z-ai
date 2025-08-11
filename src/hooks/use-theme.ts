import { useEffect } from 'react'
import { useChatStore } from '@/store/chat-store'

export function useTheme() {
  const isDarkMode = useChatStore((state) => state.isDarkMode)

  // Aplicar tema ao DOM
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDarkMode])
}