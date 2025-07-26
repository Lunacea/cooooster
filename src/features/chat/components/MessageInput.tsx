/*
 * 📄 src/features/chat/components/MessageInput.tsx
 *
 * 概要:
 * ユーザーがメッセージを入力・送信するためのフォーム。（旧ChatForm.tsx）
 * shadcn/uiのTextareaを使用して複数行メッセージ入力に対応。
 */
import * as React from 'react';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        sendMessage(inputValue);
        setInputValue('');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t p-4 dark:border-slate-700"
    >
      <Textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力... (Shift+Enter で改行)"
        disabled={isLoading}
        className="flex-1 min-h-[40px] max-h-32 resize-none"
        rows={1}
      />
      <Button 
        type="submit" 
        disabled={isLoading || !inputValue.trim()}
        size="icon"
        className="shrink-0"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">送信</span>
      </Button>
    </form>
  );
}