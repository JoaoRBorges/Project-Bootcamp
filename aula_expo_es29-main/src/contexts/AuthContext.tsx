import React from 'react'

export type UserRole = 'regular' | 'ong'

export type User = { name: string; email: string; role: UserRole }

type StoredUser = User & { password: string }

export type OngAddress = {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zip: string
}

export type Ong = {
  name: string
  address: OngAddress
  pixKey: string
  whatsapp: string
  email: string
}

export type RegisterOngPayload = {
  name: string
  address: OngAddress
  pixKey: string
  whatsapp: string
  email: string
  password: string
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  registerOng: (ong: RegisterOngPayload) => Promise<boolean>
  signOut: () => void
  // Retorna uma cópia de todos os usuários cadastrados
  getUsers: () => User[]
  // Retorna uma cópia das ONGs cadastradas
  getOngs: () => Ong[]
}

const AuthContext = React.createContext<AuthContextType>({} as AuthContextType)

// usuário em memória. Simula um pequeno repositório.
const userStore: StoredUser[] = [
  { name: 'admin', email: 'admin@local', password: '123456', role: 'regular' }
]

// ONGs em memória. Simula um pequeno repositório.
const ongStore: Ong[] = []

// Validação de email simples
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Normaliza email
const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase()
}

const stripNonDigits = (value: string): string => value.replace(/\D/g, '')

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null)
  // Retorna uma cópia de todos os usuários cadastrados
  const getUsers = React.useCallback((): User[] => {
    return userStore.map(u => ({ name: u.name, email: u.email, role: u.role }))
  }, [])

  const getOngs = React.useCallback((): Ong[] => {
    return ongStore.map(ong => ({
      ...ong,
      address: { ...ong.address },
    }))
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
      setUser({ name: found.name, email: found.email, role: found.role })
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
      password,
      role: 'regular'
    }
    userStore.push(newUser)
    return true
  }, [])

  const registerOng = React.useCallback(async ({ name, address, pixKey, whatsapp, email, password }: RegisterOngPayload) => {
    const trimmedName = name.trim()
    const normalizedWhatsapp = stripNonDigits(whatsapp)
    const trimmedPix = pixKey.trim()
    const trimmedEmail = email.trim()
    const normalizedEmail = normalizeEmail(email)
    const passwordValue = password.trim()
    const trimmedStreet = address.street.trim()
    const trimmedNumber = address.number.trim()
    const trimmedNeighborhood = address.neighborhood.trim()
    const trimmedCity = address.city.trim()
    const normalizedState = address.state.trim().toUpperCase()
    const zipDigits = stripNonDigits(address.zip)

    if (!trimmedName || trimmedName.length < 2) return false
    if (!trimmedPix) return false
    if (normalizedWhatsapp.length < 10) return false
    if (!isValidEmail(trimmedEmail)) return false
    if (passwordValue.length < 4) return false
    if (!trimmedStreet || trimmedStreet.length < 3) return false
    if (!trimmedNumber) return false
    if (!trimmedNeighborhood || trimmedNeighborhood.length < 3) return false
    if (!trimmedCity || trimmedCity.length < 2) return false
    if (normalizedState.length !== 2) return false
    if (zipDigits.length !== 8) return false

    const emailInUse = userStore.some(ongUser => normalizeEmail(ongUser.email) === normalizedEmail)
    if (emailInUse) return false

    const newUser: StoredUser = {
      name: trimmedName,
      email: normalizedEmail,
      password: passwordValue,
      role: 'ong',
    }
    userStore.push(newUser)

    ongStore.push({
      name: trimmedName,
      address: {
        street: trimmedStreet,
        number: trimmedNumber,
        neighborhood: trimmedNeighborhood,
        city: trimmedCity,
        state: normalizedState,
        zip: zipDigits,
      },
      pixKey: trimmedPix,
      whatsapp: normalizedWhatsapp,
      email: normalizedEmail,
    })
    return true
  }, [])

  const signOut = React.useCallback(() => {
    setUser(null)
  }, [])

  const contextValue = React.useMemo(
    () => ({ user, signIn, signUp, registerOng, signOut, getUsers, getOngs }),
    [user, signIn, signUp, registerOng, signOut, getUsers, getOngs]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext