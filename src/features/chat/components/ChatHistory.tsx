/*
 * 📄 src/features/chat/components/ChatHistory.tsx
 *
 * 概要:
 * チャットの履歴を表示するコンポーネント。（旧MessageList.tsx）
 * ローディング表示に`Skeleton`コンポーネントを利用。
 */
import * as React from 'react';
import { ChatMessage } from './ChatMessage';
import { Skeleton } from '@/shared/components/ui/skeleton';
import type { Message } from '@/shared/types/chat.types';

type ChatHistoryProps = {
  messages: Message[];
  isLoading: boolean;
};

export function ChatHistory({ messages, isLoading }: ChatHistoryProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 min-h-0">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <div className="text-3xl mb-3">💬</div>
            <p className="text-sm font-medium">メッセージを送信してチャットを始めましょう</p>
          </div>
        </div>
      )}
      {messages.map((msg, index) => (
        <ChatMessage key={index} role={msg.role}>
          {msg.parts.map((part, i) => (
            <span key={i}>{part.text}</span>
          ))}
        </ChatMessage>
      ))}
      {isLoading && (
        <ChatMessage role="model">
          <div className="space-y-1.5 min-w-[200px] max-w-[300px]">
            <Skeleton className="h-3 w-[85%] bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-3 w-[70%] bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="h-3 w-[55%] bg-slate-200 dark:bg-slate-700" />
          </div>
        </ChatMessage>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}