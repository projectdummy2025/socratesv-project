import path from 'path';
import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Automatically load environment variables from root .env or backend .env
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://socrates_user:socrates_secure_password@localhost:5435/socrates_db',
  },
});
