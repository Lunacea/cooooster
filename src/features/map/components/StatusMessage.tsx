'use client'

import { toast } from 'sonner'
import React from 'react'

interface StatusMessageProps {
  message: string
  type?: 'default' | 'success' | 'error' | 'warning'
}

export function StatusMessage({ message, type = 'default' }: StatusMessageProps) {
  // メッセージが変更されたときにtoastを表示
  React.useEffect(() => {
    if (message) {
      const toastOptions = {
        duration: 4000,
        position: 'bottom-left' as const,
      }

      switch (type) {
        case 'success':
          toast.success(message, toastOptions)
          break
        case 'error':
          toast.error(message, toastOptions)
          break
        case 'warning':
          toast.warning(message, toastOptions)
          break
        default:
          toast(message, toastOptions)
          break
      }
    }
  }, [message, type])

  // このコンポーネントはtoastを表示するだけなので、DOM要素は返さない
  return null
} 