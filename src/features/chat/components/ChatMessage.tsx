/*
 * 📄 src/features/chat/components/ChatMessage.tsx
 *
 * 概要:
 * 単一のチャットメッセージを表示するコンポーネント。
 * sharedからfeaturesに移動。チャット機能に特化した部品であることを明確化。
 */
import { User, Bot } from 'lucide-react';

type ChatMessageProps = {
  role: 'user' | 'model';
  children: React.ReactNode;
};

export function ChatMessage({ role, children }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
          <Bot className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-lg p-3 text-sm ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'
        }`}
      >
        {children}
      </div>
       {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
          <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </div>
      )}
    </div>
  );
}