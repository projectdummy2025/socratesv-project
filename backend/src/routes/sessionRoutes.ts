import { FastifyInstance } from 'fastify';
import { createAssemblySession } from '../services/assemblyService.js';
import { databaseClient } from '../db/index.js';
import { sessionsTable, usersTable } from '../db/schema.js';

interface SessionCreateResponse {
  sessionId: string;
  agentId: string;
  websocketUrl: string;
  sessionStatus: string;
  userId?: string;
}

// Session API routes plugin
export async function sessionRoutes(fastifyInstance: FastifyInstance): Promise<void> {
  fastifyInstance.post('/api/session/create', async (request, reply): Promise<SessionCreateResponse> => {
    const sessionIdentifier = `sess-${Date.now()}`;
    const defaultAgentIdentifier = 'agent-socrates-voice';

    // Guest user record (nama tampilan opsional dari body, tanpa verifikasi token)
    const requestBody = request.body as { userId?: string; userName?: string } | undefined;
    const guestUserId = requestBody?.userId || `guest-${Date.now()}`;
    const guestUserName = requestBody?.userName?.trim() || 'Tamu';

    try {
      await databaseClient.insert(usersTable).values({
        id: guestUserId,
        userEmail: `${guestUserName}@guest.socrates`
      }).onConflictDoNothing();
    } catch (userDbErr) {
      console.log(`(SessionRoutes) User insertion warning: ${userDbErr}`);
    }

    const { websocketEndpoint } = await createAssemblySession(sessionIdentifier);

    try {
      await databaseClient.insert(sessionsTable).values({
        id: sessionIdentifier,
        userId: guestUserId,
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
      userId: guestUserId
    });
  });
}
