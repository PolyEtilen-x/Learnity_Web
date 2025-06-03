export const useTheme = () => {
  const isDarkMode = useState('isDarkMode', () => false)

  // Load theme from localStorage on client side
  const loadTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem('isDarkMode')
      isDarkMode.value = saved ? JSON.parse(saved) : false
    }
  }

  // Save theme to localStorage
  const saveTheme = (value: boolean) => {
    if (process.client) {
      localStorage.setItem('isDarkMode', JSON.stringify(value))
    }
  }

  // Set dark mode
  const setDarkMode = (value: boolean) => {
    isDarkMode.value = value
    saveTheme(value)
  }

  // Set light mode
  const setLightMode = () => {
    isDarkMode.value = false
    saveTheme(false)
  }

  // Initialize theme on mount
  onMounted(() => {
    loadTheme()
  })

  return {
    isDarkMode: readonly(isDarkMode),
    setDarkMode,
    setLightMode,
    loadTheme
  }
}