This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up your environment variables:

Create a `.env.local` file in the root directory and add your API keys:

```bash
# Gemini API Key (サーバーサイドでのみ使用)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# データベース接続（Drizzle用）
DATABASE_URL=your_supabase_database_url
```

**重要**:
- APIキーは`NEXT_PUBLIC_`プレフィックスを付けずに設定してください。これにより、クライアントサイドでの漏洩を防ぎます。
- Supabaseの設定は、Supabaseプロジェクトのダッシュボードから取得できます。

### Supabase設定手順

1. [Supabase](https://supabase.com)でアカウントを作成し、新しいプロジェクトを作成します
2. プロジェクトの設定 > API から以下を取得します：
   - Project URL
   - anon public key
   - service_role key
3. 上記の値を`.env.local`ファイルに設定します

### データベースセットアップ

1. **SQLエディタを使用する場合:**
   - Supabaseダッシュボードの「SQL Editor」を開きます
   - `supabase-schema.sql`ファイルの内容をコピーして実行します

2. **Supabase CLIを使用する場合:**
   ```bash
   # Supabase CLIをインストール
   npm install -g supabase

   # プロジェクトを初期化
   supabase init

   # マイグレーションを実行
   supabase db push
   ```

3. **Drizzleを使用する場合:**
   ```bash
   # マイグレーションファイルを生成
   bun run db:generate

   # データベースにプッシュ
   bun run db:push
   ```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
