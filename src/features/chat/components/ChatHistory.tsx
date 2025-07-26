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
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
        <ChatMessage key={index} role={msg.role}>
          {msg.parts.map((part, i) => (
            <span key={i}>{part.text}</span>
          ))}
        </ChatMessage>
      ))}
      {isLoading && (
        <ChatMessage role="model">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </ChatMessage>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}