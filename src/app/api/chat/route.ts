/*
 * 📄 src/app/api/chat/route.ts
 *
 * 概要:
 * Gemini APIとの通信を行うAPIルート。
 * APIキーをサーバーサイドで安全に管理し、クライアントサイドでの漏洩を防ぐ。
 */
import { NextRequest, NextResponse } from 'next/server';
import type { Message, GeminiRequestPayload, GeminiResponse } from '@/shared/types/chat.types';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    const { history }: { history: Message[] } = await request.json();

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { error: 'Invalid request: history is required and must be an array' },
        { status: 400 }
      );
    }

    const payload: GeminiRequestPayload = {
      contents: history,
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Gemini API request failed with status ${response.status}` },
        { status: response.status }
      );
    }

    const data: GeminiResponse = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return NextResponse.json(
        { error: data.error.message },
        { status: 500 }
      );
    }

    const modelMessage = data.candidates?.[0]?.content;

    if (!modelMessage) {
      return NextResponse.json(
        { error: 'Invalid response format from Gemini API' },
        { status: 500 }
      );
    }

    return NextResponse.json(modelMessage);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 