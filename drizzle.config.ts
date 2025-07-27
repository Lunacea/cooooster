import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { resolve } from 'path';

// .env.localファイルを明示的に読み込み
config({ path: resolve(process.cwd(), '.env.local') });

// 環境変数の確認
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
