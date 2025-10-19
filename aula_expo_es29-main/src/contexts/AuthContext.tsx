import React from 'react'

type User = { name: string; email: string }

type StoredUser = User & { password: string }

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
  // Retorna uma cópia de todos os usuários cadastrados
  getUsers: () => User[]
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType)

// usuário em memória. Simula um pequeno repositório.
const userStore: StoredUser[] = [
  { name: 'admin', email: 'admin@local', password: '123456' }
]

// Validação de email simples
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Normaliza email
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null)
  // Retorna uma cópia de todos os usuários cadastrados
  const getUsers = React.useCallback((): User[] => {
    return userStore.map(u => ({ name: u.name, email: u.email }))
  }, [])

  
  const signIn = React.useCallback(async (email: string, password: string) => {
    // Validações básicas
    if (!email || !password) return false
    if (password.length < 4) return false
    
    const normalizedEmail = normalizeEmail(email)
    
    const found = userStore.find(
      u => normalizeEmail(u.email) === normalizedEmail && u.password === password
    )
    
    if (found) {
      setUser({ name: found.name, email: found.email })
      return true
    }
    return false
  }, [])

  
  const signUp = React.useCallback(async (name: string, email: string, password: string) => {
    // Validações
    if (!name || !email || password.length < 4) return false
    
    // Validação de nome (mínimo 2 caracteres)
    if (name.trim().length < 2) return false
    
    // Validação de email
    if (!isValidEmail(email)) return false

    const normalizedEmail = normalizeEmail(email)
    const exists = userStore.some(u => normalizeEmail(u.email) === normalizedEmail)
    
    if (exists) return false

    const newUser: StoredUser = { 
      name: name.trim(), 
      email: normalizedEmail, 
      password 
    }
    userStore.push(newUser)
    return true
  }, [])

  const signOut = React.useCallback(() => {
    setUser(null)
  }, [])

  const contextValue = React.useMemo(() => ({ user, signIn, signUp, signOut, getUsers }), [user, signIn, signUp, signOut, getUsers])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext