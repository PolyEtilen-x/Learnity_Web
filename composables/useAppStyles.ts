export const useAppStyles = () => {
  const { isDarkMode } = useTheme()

  // Colors
  const colors = computed(() => ({
    // Light mode colors
    background: '#A0EACF',
    backgroundSecond: '#0F2A19',
    buttonBg: '#0F2A19',
    buttonBgProfile: '#9EB9A8',
    textPrimary: '#000000',
    textSecondary: '#6C6C6C',
    textThird: '#A5AFA8',
    buttonText: '#A0EACF',
    white: '#FFFFFF',
    black: '#000000',
    buttonEditProfile: '#0F2A19',

    // Dark mode colors
    darkBackground: '#0F2A19',
    darkBackgroundSecond: '#A0EACF',
    darkButtonBg: '#2C2C2C',
    darkButtonBgProfile: '#3A3A3A',
    darkTextPrimary: '#FFFFFF',
    darkTextSecondary: '#B0B0B0',
    darkTextThird: '#8E8E8E',
    darkButtonText: '#00FFB3'
  }))

  const textStyles = {
    title: () => ({
      fontSize: '40px',
      fontWeight: '900',
      color: isDarkMode.value ? colors.value.darkTextPrimary : colors.value.textPrimary
    }),

    subtitle: () => ({
      fontSize: '25px',
      fontWeight: '800',
      color: isDarkMode.value ? colors.value.darkTextPrimary : colors.value.textPrimary
    }),

    subtitle2: () => ({
      fontSize: '22px',
      fontWeight: '700',
      color: isDarkMode.value ? colors.value.darkTextThird : colors.value.textThird
    }),

    body: () => ({
      fontSize: '16px',
      fontWeight: 'normal',
      color: isDarkMode.value ? colors.value.darkTextPrimary : colors.value.textPrimary
    }),

    bodySecondary: () => ({
      fontSize: '14px',
      fontWeight: 'normal',
      color: isDarkMode.value ? colors.value.darkTextSecondary : colors.value.textSecondary
    }),

    caption: () => ({
      fontSize: '12px',
      fontWeight: '400',
      color: isDarkMode.value ? colors.value.darkTextThird : colors.value.textThird
    }),

    textButton: () => ({
      fontSize: '17px',
      fontWeight: '600',
      color: isDarkMode.value ? colors.value.darkButtonText : colors.value.buttonText
    }),

    label: () => ({
      fontSize: '16px',
      fontWeight: '700',
      color: isDarkMode.value ? colors.value.darkTextPrimary : colors.value.textPrimary
    }),

    hint: () => ({
      fontSize: '16px',
      fontStyle: 'italic',
      color: isDarkMode.value 
        ? `${colors.value.darkTextSecondary}99` 
        : `${colors.value.textSecondary}99`
    }),

    link: () => ({
      fontSize: '15px',
      fontWeight: '500',
      color: isDarkMode.value ? '#93C5FD' : '#3B82F6',
      textDecoration: 'underline'
    }),

    error: () => ({
      fontSize: '14px',
      fontWeight: '500',
      color: '#EF4444'
    }),

    placeholder: () => ({
      fontSize: '15px',
      fontWeight: 'normal',
      color: isDarkMode.value ? colors.value.darkTextThird : colors.value.textThird
    }),

    inputText: () => ({
      fontSize: '16px',
      fontWeight: '500',
      color: isDarkMode.value ? colors.value.darkTextPrimary : colors.value.textPrimary
    })
  }

  // Background styles
  const backgrounds = computed(() => ({
    main: isDarkMode.value ? colors.value.darkBackground : colors.value.background,
    secondary: isDarkMode.value ? colors.value.darkBackgroundSecond : colors.value.backgroundSecond,
    footer: isDarkMode.value ? colors.value.background : colors.value.darkBackground
  }))

  // Icon styles
  const iconStyles = computed(() => ({
    footbar: isDarkMode.value ? colors.value.darkBackground : colors.value.background,
    primary: isDarkMode.value ? colors.value.white : colors.value.black,
    secondary: isDarkMode.value ? colors.value.darkTextSecondary : colors.value.textSecondary
  }))

  return {
    colors,
    textStyles,
    backgrounds,
    iconStyles
  }
}