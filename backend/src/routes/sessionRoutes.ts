import { FastifyInstance } from 'fastify';
import { createAssemblySession } from '../services/assemblyService.js';
import { verifySupabaseToken } from '../services/authService.js';
import { databaseClient } from '../db/index.js';
import { sessionsTable, usersTable } from '../db/schema.js';

interface SessionCreateResponse {
  sessionId: string;
  agentId: string;
  websocketUrl: string;
  sessionStatus: string;
  userId?: string;
}

// Session API routes plugin with Supabase Auth integration
export async function sessionRoutes(fastifyInstance: FastifyInstance): Promise<void> {
  fastifyInstance.post('/api/session/create', async (request, reply): Promise<SessionCreateResponse> => {
    const sessionIdentifier = `sess-${Date.now()}`;
    const defaultAgentIdentifier = 'agent-socrates-voice';

    // Verify Supabase Auth token from Authorization header
    const authHeader = request.headers.authorization;
    const authUser = await verifySupabaseToken(authHeader);
    const authenticatedUserId = authUser?.userId || null;

    // Ensure user record exists if authenticated
    if (authUser) {
      try {
        await databaseClient.insert(usersTable).values({
          id: authUser.userId,
          userEmail: authUser.userEmail
        }).onConflictDoNothing();
      } catch (userDbErr) {
        console.log(`(SessionRoutes) User insertion warning: ${userDbErr}`);
      }
    }

    const { websocketEndpoint } = await createAssemblySession(sessionIdentifier);

    try {
      await databaseClient.insert(sessionsTable).values({
        id: sessionIdentifier,
        userId: authenticatedUserId,
        agentId: defaultAgentIdentifier,
        sessionStatus: 'active'
      });
    } catch (dbError) {
      console.log(`(SessionRoutes) Database insertion warning: ${dbError}`);
    }

    return reply.code(200).send({
      sessionId: sessionIdentifier,
      agentId: defaultAgentIdentifier,
      websocketUrl: websocketEndpoint,
      sessionStatus: 'active',
      userId: authenticatedUserId || undefined
    });
  });
}
