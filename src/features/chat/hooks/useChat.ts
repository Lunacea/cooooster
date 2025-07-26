/*
 * 📄 src/features/chat/hooks/useChat.ts
 *
 * 概要:
 * チャットの状態（メッセージ履歴、ローディング、エラー）を管理するカスタムフック。
 * API呼び出しは`features/chat/api/gemini.ts`に委譲し、自身は状態管理に専念。
 */
import { useState, useCallback } from 'react';
import type { Message } from '@/shared/types/chat.types';
import { postToGemini } from '@/features/chat/api/gemini';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: 'user',
      parts: [{ text }],
    };

    const newMessages = [...messages, userMessage];
    
    setIsLoading(true);
    setError(null);
    setMessages(newMessages);

    try {
      const modelMessage = await postToGemini(newMessages);
      setMessages((prev) => [...prev, modelMessage]);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('An unknown error occurred'));
      // エラー時にユーザーのメッセージを元に戻す場合は以下のコメントを外す
      // setMessages(messages); 
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return { messages, isLoading, error, sendMessage };
}