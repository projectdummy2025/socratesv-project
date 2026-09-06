// Crisis detection scanning result
export interface CrisisScanResult {
  isDangerous: boolean;
  riskLevel: string;
  detectedKeyword: string;
}

// Scans user transcript input for critical crisis keywords
export function scanCrisisKeywords(userTranscript: string): CrisisScanResult {
  const textContent = (userTranscript || '').toLowerCase();
  const crisisKeywords = ['bunuh diri', 'suicide', 'akhiri hidup', 'harm myself', 'want to die'];

  for (const keyword of crisisKeywords) {
    if (textContent.includes(keyword)) {
      return {
        isDangerous: true,
        riskLevel: 'high',
        detectedKeyword: keyword
      };
    }
  }

  return {
    isDangerous: false,
    riskLevel: 'low',
    detectedKeyword: ''
  };
}
