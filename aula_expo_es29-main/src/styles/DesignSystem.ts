// Design System - Cores, Tipografia e Espaçamentos
export const Colors = {
  // Cores primárias
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA6FF',
  
  // Cores secundárias
  secondary: '#34C759',
  secondaryDark: '#28A745',
  secondaryLight: '#5DD579',
  
  // Cores de status
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',
  
  // Cores neutras
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceSecondary: '#F8F9FA',
  
  // Cores de texto
  textPrimary: '#1C1C1E',
  textSecondary: '#6D6D70',
  textTertiary: '#8E8E93',
  textInverse: '#FFFFFF',
  
  // Cores de borda
  border: '#E5E5EA',
  borderLight: '#F2F2F7',
  
  // Cores de sombra
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Cores específicas do app
  whatsapp: '#25D366',
  mapPin: '#FF3B30',
  ongCard: '#FFF3E0',
}

export const Typography = {
  // Tamanhos de fonte
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '600' as const, lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  h4: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body1: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  body2: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  
  // Estilos específicos
  title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  subtitle: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  small: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  
  // Espaçamentos específicos
  screenPadding: 20,
  cardPadding: 16,
  buttonPadding: 12,
  iconSize: 24,
  avatarSize: 60,
}

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  round: 50,
}

export const Shadows = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
}

// Componentes base reutilizáveis
export const BaseStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.screenPadding,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.cardPadding,
    ...Shadows.small,
  },
  button: {
    paddingVertical: Spacing.buttonPadding,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    ...Shadows.small,
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.buttonPadding,
    fontSize: Typography.body1.fontSize,
    color: Colors.textPrimary,
  },
}
