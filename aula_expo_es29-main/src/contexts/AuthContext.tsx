import React from 'react'

type User = { name: string; email: string }

type StoredUser = User & { password: string }

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType)

// In-memory user store (module-scoped). This simulates a tiny repo.
const userStore: StoredUser[] = [
  { name: 'admin', email: 'admin@local', password: '123456' }
]

// Validação de email simples
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Normaliza email (trim + lowercase)
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null)

  // sign in checks the in-memory userStore
  async function signIn(email: string, password: string) {
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
  }

  // sign up adds to the in-memory store (without auto-login)
  async function signUp(name: string, email: string, password: string) {
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
  }

  function signOut() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext