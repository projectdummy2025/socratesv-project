import { FastifyInstance } from 'fastify';

interface ChatMessage {
  role: string;
  content: string;
}

interface CbtAnalyzeRequest {
  userThought: string;
  conversationHistory?: ChatMessage[];
}

// CBT Proxy route to forward requests to Python microservice
export async function cbtRoutes(fastifyInstance: FastifyInstance): Promise<void> {
  fastifyInstance.post('/api/cbt/analyze', async (request, reply) => {
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL;
    const requestBody = request.body as CbtAnalyzeRequest;

    try {
      const response = await fetch(`${pythonServiceUrl}/api/cbt/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const responseData = await response.json();
        return reply.code(200).send(responseData);
      }
    } catch (err) {
      console.log(`(CbtRoutes) Failed reaching Python CBT microservice: ${err}`);
    }

    // Fallback response if Python microservice is offline
    return reply.code(200).send({
      currentStep: 'challenge',
      empathySummary: `I hear how heavy and exhausting this situation feels for you right now.`,
      challengeQuestion: `When this thought comes up, is there another perspective that might bring you some peace of mind?`,
      replacementThought: 'You are doing your best, and it is completely okay to take things one gentle step at a time.'
    });
  });
}
