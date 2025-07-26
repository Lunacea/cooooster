/*
 * 📄 src/features/chat/Chat.tsx
 *
 * 概要:
 * チャット機能の主要コンポーネント。
 * `useChat`フックからロジックを取得し、`ChatHistory`と`MessageInput`を結合する。
 */
import { useChat } from '@/features/chat/hooks/useChat';
import { ChatHistory } from '@/features/chat/components/ChatHistory';
import { MessageInput } from '@/features/chat/components/MessageInput';

export function Chat() {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <>
      <ChatHistory messages={messages} isLoading={isLoading} />
      {error && (
        <div className="p-4 text-sm text-red-500 border-t dark:border-slate-700">
          エラー: {error.message}
        </div>
      )}
      <MessageInput sendMessage={sendMessage} isLoading={isLoading} />
    </>
  );
}