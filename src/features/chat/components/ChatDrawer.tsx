/*
 * 📄 src/features/chat/components/ChatDrawer.tsx
 *
 * 概要:
 * チャット機能をDrawerとして表示するコンポーネント。
 * Menu.tsxから呼び出され、スライドインでチャット機能を提供する。
 */
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer';
import { Chat } from '@/features/chat/Chat';
import { useChat } from '@/features/chat/hooks/useChat';

interface ChatDrawerProps {
  trigger: React.ReactNode;
}

export function ChatDrawer({ trigger }: ChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading } = useChat();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] flex flex-col">
        <DrawerHeader className="flex items-center justify-between border-b">
          <DrawerTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Gemini Chatbot
            {isLoading && (
              <span className="text-xs text-gray-500 ml-2">応答中...</span>
            )}
          </DrawerTitle>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="チャットを閉じる"
            title="チャットを閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </DrawerHeader>
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <Chat />
        </div>
      </DrawerContent>
    </Drawer>
  );
} 