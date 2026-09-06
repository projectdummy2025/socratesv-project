import path from 'path';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { runDrizzleColdstartMigration } from './db/index.js';
import { sessionRoutes } from './routes/sessionRoutes.js';
import { crisisRoutes } from './routes/crisisRoutes.js';
import { cbtRoutes } from './routes/cbtRoutes.js';

// Automatically load environment variables from root .env or backend .env
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const server = Fastify({
  logger: false,
});

// Register CORS middleware
await server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Register API Routes
await server.register(sessionRoutes);
await server.register(crisisRoutes);
await server.register(cbtRoutes);

// Health check endpoint
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server listening on configured port after executing automatic Drizzle coldstart migration
const serverPort = Number(process.env.PORT_BACKEND || 3455);
try {
  await runDrizzleColdstartMigration();
  await server.listen({ port: serverPort, host: '0.0.0.0' });
  console.log(`Backend server running on port ${serverPort}`);
} catch (err) {
  console.error('Failed starting backend server:', err);
  process.exit(1);
}
