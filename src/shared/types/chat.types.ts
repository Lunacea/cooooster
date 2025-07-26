/*
 * 📄 src/shared/types/chat.types.ts
 *
 * 概要:
 * アプリケーション全体、特にチャット機能で利用される型定義を管理します。
 * 型を一元管理することで、一貫性と再利用性を高めます。
 */
export type MessagePart = {
    text: string;
  };
  
  export type Message = {
    role: 'user' | 'model';
    parts: MessagePart[];
  };
  
  export type GeminiRequestPayload = {
    contents: Message[];
  };
  
  export type GeminiResponse = {
    candidates?: {
      content: Message;
    }[];
    error?: {
      message: string;
    };
  };