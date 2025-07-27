'use client'

import Image from 'next/image';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Button } from '@/shared/components/ui/button';
import { LogOut, User } from 'lucide-react';

export default function Header(props: { font: string }) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('ログアウトエラー:', err)
    }
  }

  return (
    <header className="p-2 backdrop-blur-md rounded-xl shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/cooooster_Icon.png"
            alt="Cooooster Icon"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h1 className={`${props.font} text-bice-blue-400 font-bold text-2xl pr-3`}>
            Cooooster
          </h1>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">ログアウト</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
