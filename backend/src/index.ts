import Fastify from "fastify";
import cors from "@fastify/cors";

// Initialize Fastify server instance
const server = Fastify({ logger: false });

// Register CORS middleware for cross-origin requests
await server.register(cors, { origin: true });

// Helper function to format logs according to AGENTS.md: (YYYY-MM-DD HH:mm:ss) functionality message
function logMessage(messageText: string): void {
  const currentTimestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
  console.log(`(${currentTimestamp}) ${messageText}`);
}

// Interfaces for response data validation
interface HealthStatus {
  serviceStatus: string;
  serviceName: string;
}

interface SessionData {
  sessionId: string;
  agentId: string;
  sessionStatus: string;
}

// Health check endpoint for system readiness verification
server.get("/health", async (): Promise<HealthStatus> => {
  // Log request execution
  logMessage("Backend health check requested");

  return {
    serviceStatus: "ok",
    serviceName: "socrates-backend"
  };
});

// Create new AssemblyAI session endpoint
server.post("/api/session/create", async (request, reply): Promise<SessionData> => {
  // Log session creation process
  logMessage("Creating new AssemblyAI session");

  // Generate unique session identifier
  const generatedId = `session-${Date.now()}`;

  // Return formatted session metadata
  return reply.code(200).send({
    sessionId: generatedId,
    agentId: "agent-socrates-demo",
    sessionStatus: "active"
  });
});

// Extract port configuration from environment or default to 3455
const serverPort = Number(process.env.PORT_BACKEND) || 3455;

// Start listening for incoming connections
try {
  await server.listen({ port: serverPort, host: "0.0.0.0" });
  logMessage(`Backend server running on port ${serverPort}`);
} catch (serverError) {
  logMessage(`Failed starting backend server: ${serverError}`);
  process.exit(1);
}
