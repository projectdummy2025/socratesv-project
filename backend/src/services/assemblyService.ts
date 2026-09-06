// Format timestamp according to AGENTS.md requirements: (YYYY-MM-DD HH:mm:ss)
function logMessage(messageText: string): void {
  const currentTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`(${currentTimestamp}) ${messageText}`);
}

interface AssemblySessionResult {
  websocketEndpoint: string;
}

// Request new Voice Agent session token from AssemblyAI API
export async function createAssemblySession(sessionIdentifier: string): Promise<AssemblySessionResult> {
  const assemblyApiKey = process.env.ASSEMBLYAI_API_KEY;
  let websocketEndpoint = `wss://streaming.assemblyai.com/v3/ws?session=${sessionIdentifier}`;

  if (assemblyApiKey) {
    try {
      logMessage('Calling AssemblyAI API for active session token');
      const apiResponse = await fetch('https://streaming.assemblyai.com/v3/token?expires_in_seconds=300', {
        method: 'GET',
        headers: {
          'Authorization': assemblyApiKey
        }
      });
      if (apiResponse.ok) {
        const responseData = await apiResponse.json() as { token?: string };
        if (responseData.token) {
          websocketEndpoint = `wss://streaming.assemblyai.com/v3/ws?token=${responseData.token}&sample_rate=16000&encoding=pcm_s16le`;
        }
      } else {
        const errorText = await apiResponse.text();
        logMessage(`AssemblyAI API request failed status ${apiResponse.status}: ${errorText}`);
      }
    } catch (apiError) {
      logMessage(`AssemblyAI API request warning: ${apiError}`);
    }
  }

  return { websocketEndpoint };
}
