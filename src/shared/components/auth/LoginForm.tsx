'use client'

import { useState } from 'react'
import { useAuth } from '@/shared/contexts/AuthContext'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { toast } from 'sonner'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password)

      if (result.error) {
        toast.error(result.error.message)
      } else {
        toast.success(isSignUp ? 'アカウントを作成しました！' : 'ログインしました！')
      }
    } catch {
      toast.error('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isSignUp ? 'アカウント作成' : 'ログイン'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp
              ? '新しいアカウントを作成してください'
              : 'アカウントにログインしてください'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '処理中...' : (isSignUp ? 'アカウント作成' : 'ログイン')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isSignUp
                ? '既にアカウントをお持ちですか？ログイン'
                : 'アカウントをお持ちでないですか？新規登録'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 