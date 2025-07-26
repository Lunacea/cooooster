/*
 * 📄 src/features/chat/components/ChatMessage.tsx
 *
 * 概要:
 * 単一のチャットメッセージを表示するコンポーネント。
 * sharedからfeaturesに移動。チャット機能に特化した部品であることを明確化。
 * shadcn/uiのAvatarとCardコンポーネントを使用して改善。
 */
import { User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

type ChatMessageProps = {
  role: 'user' | 'model';
  children: React.ReactNode;
};

export function ChatMessage({ role, children }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <Avatar className="flex-shrink-0 w-10 h-10">
          <AvatarImage src="" alt="Bot" />
          <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-xs">
            <Bot className="h-3 w-3 text-slate-600 dark:text-slate-300" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isUser
        ? 'bg-blue-600 text-white'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
        }`}>
        {children}
      </div>
      {isUser && (
        <Avatar className="flex-shrink-0 w-10 h-10">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-xs">
            <User className="h-3 w-3 text-slate-600 dark:text-slate-300" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}