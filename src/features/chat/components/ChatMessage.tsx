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
import { Card, CardContent } from '@/shared/components/ui/card';

type ChatMessageProps = {
  role: 'user' | 'model';
  children: React.ReactNode;
};

export function ChatMessage({ role, children }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <Avatar className="flex-shrink-0">
          <AvatarImage src="" alt="Bot" />
          <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
            <Bot className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </AvatarFallback>
        </Avatar>
      )}
      <Card className={`max-w-[75%] ${
        isUser
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-slate-100 dark:bg-slate-800'
      }`}>
        <CardContent className="p-3 text-sm">
          {children}
        </CardContent>
      </Card>
      {isUser && (
        <Avatar className="flex-shrink-0">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
            <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}