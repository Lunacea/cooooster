'use client'

import { useAuth } from '@/shared/contexts/AuthContext'
import { LoginForm } from './LoginForm'
import { LoadingSpinner } from '@/shared/components/ui/loading'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <>{children}</>
} 