export interface SessionResponseData {
  sessionId: string;
  agentId: string;
  websocketUrl: string;
}

export interface CrisisResponseData {
  isDangerous: boolean;
  riskLevel: string;
}

export interface CbtAnalysisResponseData {
  currentStep: string;
  challengeQuestion: string;
  replacementThought: string;
}

function getBackendUrl(): string {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return ''; // Use relative path proxied by Vite for remote/tunnel access
  }
  return import.meta.env.VITE_BACKEND_SERVICE_URL || 'http://localhost:3455';
}

// Request backend to create AssemblyAI Voice Agent session (guest mode)
export async function requestNewSession(userId?: string, userName?: string): Promise<SessionResponseData> {
  const backendUrl = getBackendUrl();
  try {
    const apiResponse = await fetch(`${backendUrl}/api/session/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, userName })
    });
    if (apiResponse.ok) {
      return await apiResponse.json() as SessionResponseData;
    }
  } catch (errorInstance) {
    console.warn('Backend session creation offline demo mode:', errorInstance);
  }
  return {
    sessionId: `sess-demo-${Date.now()}`,
    agentId: 'agent-socrates-demo',
    websocketUrl: ''
  };
}

// Request backend crisis intent check
export async function requestCrisisCheck(sessionId: string, userTranscript: string): Promise<CrisisResponseData> {
  const backendUrl = getBackendUrl();
  try {
    const apiResponse = await fetch(`${backendUrl}/api/crisis/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, userTranscript })
    });
    if (apiResponse.ok) {
      return await apiResponse.json() as CrisisResponseData;
    }
  } catch (errorInstance) {
    console.warn('Crisis check request warning:', errorInstance);
  }
  return { isDangerous: false, riskLevel: 'low' };
}

// Request Gemini CBT Socratic analysis from backend
export async function requestCbtAnalysis(userThought: string): Promise<CbtAnalysisResponseData> {
  const backendUrl = getBackendUrl();
  try {
    const apiResponse = await fetch(`${backendUrl}/api/cbt/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userThought })
    });
    if (apiResponse.ok) {
      return await apiResponse.json() as CbtAnalysisResponseData;
    }
  } catch (errorInstance) {
    console.warn('CBT analysis request warning:', errorInstance);
  }

  return {
    currentStep: 'challenge',
    challengeQuestion: `Apakah ada bukti nyata yang mendukung pikiran: '${userThought}'?`,
    replacementThought: 'Mari kita pertimbangkan situasi ini dari perspektif yang lebih seimbang.'
  };
}
