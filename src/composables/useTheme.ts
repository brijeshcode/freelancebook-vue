// composables/useTheme.ts
import { ref, computed, onMounted, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const THEME_STORAGE_KEY = 'freelance-theme'

export function useTheme() {
  const theme = ref<Theme>('system')
  const isDark = ref(false)

  // Computed property to get the current theme
  const currentTheme = computed(() => theme.value)

  // Function to detect system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Function to apply theme to document
  const applyTheme = (newTheme: Theme) => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    if (newTheme === 'system') {
      const systemTheme = getSystemTheme()
      root.classList.add(systemTheme)
      isDark.value = systemTheme === 'dark'
    } else {
      root.classList.add(newTheme)
      isDark.value = newTheme === 'dark'
    }
  }

  // Function to set theme
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    applyTheme(newTheme)
    
    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
  }

  // Function to toggle between light and dark
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Function to cycle through themes
  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  // Initialize theme on mount
  const initializeTheme = () => {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setTheme(stored)
        return
      }
    }
    
    // Default to system preference
    setTheme('system')
  }

  // Watch for system theme changes
  const watchSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleSystemThemeChange = () => {
        if (theme.value === 'system') {
          applyTheme('system')
        }
      }

      mediaQuery.addEventListener('change', handleSystemThemeChange)
      
      // Return cleanup function
      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      }
    }
  }

  // Watch theme changes
  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  onMounted(() => {
    initializeTheme()
    const cleanup = watchSystemTheme()
    
    // Return cleanup function for component unmount
    return cleanup
  })

  return {
    theme: currentTheme,
    isDark: computed(() => isDark.value),
    setTheme,
    toggleTheme,
    cycleTheme,
    initializeTheme
  }
}