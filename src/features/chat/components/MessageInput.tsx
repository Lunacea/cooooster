/*
 * 📄 src/features/chat/components/MessageInput.tsx
 *
 * 概要:
 * ユーザーがメッセージを入力・送信するためのフォーム。（旧ChatForm.tsx）
 */
import * as React from 'react';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Send } from 'lucide-react';

type MessageInputProps = {
  sendMessage: (text: string) => void;
  isLoading: boolean;
};

export function MessageInput({ sendMessage, isLoading }: MessageInputProps) {
  const [inputValue, setInputValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t p-4 dark:border-slate-700"
    >
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="メッセージを入力..."
        disabled={isLoading}
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
          }
        }}
      />
      <Button type="submit" disabled={isLoading || !inputValue.trim()}>
        <Send className="h-5 w-5" />
        <span className="sr-only">送信</span>
      </Button>
    </form>
  );
}