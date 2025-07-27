/*
 * 📄 src/widgets/ChatWidget.tsx
 *
 * 概要:
 * チャット機能をウィジェットとして提供するコンポーネント。（旧Chatbot.tsx）
 * `features/chat/Chat.tsx`をラップし、アプリケーションの特定の場所に配置可能にする。
 * ローディング状態を適切に表示する。
 */
'use client';

import { useChat } from '@/features/chat/hooks/useChat';
import { Chat } from '@/features/chat/Chat';

export function ChatBot() {
  const { isLoading } = useChat();

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full max-w-2xl mx-auto flex-col rounded-lg border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 min-h-0">
      <div className="p-4 border-b dark:border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Gemini Chatbot</h1>
          {isLoading && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">応答中...</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Chat />
      </div>
    </div>
  );
}

// デフォルトエクスポートを追加
export default ChatBot;