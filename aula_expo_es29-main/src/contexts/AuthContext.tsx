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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null)

  // sign in checks the in-memory userStore
  async function signIn(email: string, password: string) {
    const found = userStore.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (found) {
      setUser({ name: found.name, email: found.email })
      return true
    }
    return false
  }

  // sign up adds to the in-memory store and auto-login
  async function signUp(name: string, email: string, password: string) {
    if (!name || !email || password.length < 4) return false

    const exists = userStore.some(u => u.email.toLowerCase() === email.toLowerCase())
    if (exists) return false

    const newUser: StoredUser = { name, email, password }
    userStore.push(newUser)
    setUser({ name, email })
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
