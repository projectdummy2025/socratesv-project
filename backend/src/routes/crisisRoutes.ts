import { FastifyInstance } from 'fastify';
import { scanCrisisKeywords } from '../services/crisisService.js';
import { databaseClient } from '../db/index.js';
import { crisisEventsTable } from '../db/schema.js';

interface CrisisCheckRequest {
  sessionId?: string;
  userTranscript: string;
}

interface CrisisCheckResponse {
  isDangerous: boolean;
  riskLevel: string;
  actionRequired: string;
}

// Crisis API routes plugin
export async function crisisRoutes(fastifyInstance: FastifyInstance): Promise<void> {
  fastifyInstance.post('/api/crisis/detect', async (request, reply): Promise<CrisisCheckResponse> => {
    const requestBody = request.body as CrisisCheckRequest;
    const scanResult = scanCrisisKeywords(requestBody?.userTranscript || '');

    if (scanResult.isDangerous) {
      if (requestBody.sessionId) {
        try {
          await databaseClient.insert(crisisEventsTable).values({
            id: `crisis-${Date.now()}`,
            sessionId: requestBody.sessionId,
            riskLevel: scanResult.riskLevel,
            triggerPhrase: scanResult.detectedKeyword
          });
        } catch (dbLogErr) {
          console.log(`Failed logging crisis event: ${dbLogErr}`);
        }
      }
      return reply.code(200).send({
        isDangerous: true,
        riskLevel: scanResult.riskLevel,
        actionRequired: 'PAUSE_SESSION_SHOW_HELPLINE'
      });
    }

    return reply.code(200).send({
      isDangerous: false,
      riskLevel: 'low',
      actionRequired: 'CONTINUE_SESSION'
    });
  });
}
