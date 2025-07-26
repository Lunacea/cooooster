/*
 * 📄 src/features/chat/api/gemini.ts
 *
 * 概要:
 * 内部APIルートを通じてGemini APIとの通信を行う関数。
 * APIキーをサーバーサイドで安全に管理し、クライアントサイドでの漏洩を防ぐ。
 */
import type { Message } from '@/shared/types/chat.types';

export const postToGemini = async (history: Message[]): Promise<Message> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ history }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API request failed with status ${response.status}`);
  }

  const modelMessage: Message = await response.json();
  return modelMessage;
};