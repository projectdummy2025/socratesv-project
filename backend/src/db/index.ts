import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema.js';

// Automatically load environment variables from root .env or backend .env
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Database connection string from environment
const databaseUrl = process.env.DATABASE_URL || 'postgresql://socrates_user:socrates_secure_password@localhost:5435/socrates_db';

// Initialize postgres client pool
export const queryClient = postgres(databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10
});

// Drizzle ORM instance
export const databaseClient = drizzle(queryClient, { schema });

// Automated Drizzle coldstart schema migration
export async function runDrizzleColdstartMigration(): Promise<void> {
  const migrationsDirectory = path.resolve(process.cwd(), 'drizzle');
  try {
    execSync('npx drizzle-kit generate', { stdio: 'ignore' });
    await migrate(databaseClient, { migrationsFolder: migrationsDirectory });
    console.log('(Coldstart) Drizzle database migration executed successfully');
  } catch (error) {
    console.warn('(Coldstart) Drizzle migration status:', error instanceof Error ? error.message : String(error));
  }
}
