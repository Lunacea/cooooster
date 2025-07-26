/*
 * 📄 src/features/chat/api/gemini.ts
 *
 * 概要:
 * Gemini APIとの通信を実際に行う関数。
 * useChatフックからロジックを分離し、API通信の責務を明確化。
 */
import type { Message, GeminiRequestPayload, GeminiResponse } from '@/shared/types/chat.types';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`;

export const postToGemini = async (history: Message[]): Promise<Message> => {
  const payload: GeminiRequestPayload = {
    contents: history,
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: GeminiResponse = await response.json();
  
  if (data.error) {
    throw new Error(data.error.message);
  }

  const modelMessage = data.candidates?.[0]?.content;

  if (!modelMessage) {
    throw new Error('Invalid response format from API');
  }

  return modelMessage;
};