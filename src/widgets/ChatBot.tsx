/*
 * 📄 src/widgets/ChatWidget.tsx
 *
 * 概要:
 * チャット機能をウィジェットとして提供するコンポーネント。（旧Chatbot.tsx）
 * `features/chat/Chat.tsx`をラップし、アプリケーションの特定の場所に配置可能にする。
 */
'use client';

import { Chat } from '@/features/chat/Chat';

export function ChatBot() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full max-w-2xl mx-auto flex-col rounded-lg border bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="p-4 border-b dark:border-slate-700">
        <h1 className="text-lg font-semibold">Gemini Chatbot</h1>
      </div>
      <Chat />
    </div>
  );
}

// デフォルトエクスポートを追加
export default ChatBot;