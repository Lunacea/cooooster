'use client'

import React from 'react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

interface StatusMessageProps {
  message: string
  type?: 'default' | 'success' | 'error' | 'warning'
}

export function StatusMessage({ message, type = 'default' }: StatusMessageProps) {
  const [messages, setMessages] = React.useState<Array<{
    id: string
    message: string
    type: 'default' | 'success' | 'error' | 'warning'
    timestamp: number
    isRemoving: boolean
  }>>([])

  // メッセージが変更されたときに新しいメッセージを追加
  React.useEffect(() => {
    if (message) {
      const newMessage = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: Date.now(),
        isRemoving: false
      }

      setMessages(prev => [newMessage, ...prev.slice(0, 4)]) // 最新5件まで保持

      // 5秒後にメッセージをフェードアウト
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, isRemoving: true } : msg
        ))

        // フェードアウトアニメーション完了後に削除
        setTimeout(() => {
          setMessages(prev => prev.filter(msg => msg.id !== newMessage.id))
        }, 300) // アニメーション時間
      }, 5000)
    }
  }, [message, type])

  const getIcon = (type: 'default' | 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getCardStyle = (type: 'default' | 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const handleRemoveMessage = (id: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === id ? { ...msg, isRemoving: true } : msg
    ))

    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id))
    }, 300)
  }

  if (messages.length === 0) return null

  return (
    <div className="fixed top-24 left-4 right-4 sm:left-4 sm:right-auto z-50 space-y-2 max-w-md w-auto sm:w-full">
      {messages.map((msg, index) => (
        <Card
          key={msg.id}
          className={`${getCardStyle(msg.type)} shadow-lg border transition-all duration-300 ${msg.isRemoving
            ? 'opacity-0 transform -translate-y-2 scale-95'
            : 'opacity-100 transform translate-y-0 scale-100 animate-in slide-in-from-top-2'
            }`}
          style={{
            animationDelay: msg.isRemoving ? '0ms' : `${index * 100}ms`
          }}
        >
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              {getIcon(msg.type)}
              <p className="text-sm font-medium text-gray-900 flex-1 break-words">
                {msg.message}
              </p>
              <button
                onClick={() => handleRemoveMessage(msg.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="メッセージを閉じる"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 