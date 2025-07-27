'use client'

import { AuthProvider } from '@/shared/contexts/AuthContext'

interface ClientAuthProviderProps {
  children: React.ReactNode
}

export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return <AuthProvider>{children}</AuthProvider>
} 