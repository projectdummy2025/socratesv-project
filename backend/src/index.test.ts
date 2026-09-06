import { scanCrisisKeywords } from './services/crisisService.js';
import { verifySupabaseToken } from './services/authService.js';

async function runBackendTests(): Promise<void> {
  // Test 1: Crisis keyword scanning
  const safeResult = scanCrisisKeywords("Saya cemas tentang presentasi");
  if (safeResult.isDangerous) {
    throw new Error("Test failed: Safe transcript misclassified");
  }

  const dangerResult = scanCrisisKeywords("Saya merasa hopeless dan mau bunuh diri");
  if (!dangerResult.isDangerous) {
    throw new Error("Test failed: Danger transcript misclassified");
  }

  // Test 2: Supabase Token Verification (Demo fallback when env empty)
  const authPayload = await verifySupabaseToken("Bearer demo-token-12345");
  if (!authPayload || !authPayload.userId) {
    throw new Error("Test failed: Supabase token verification returned invalid payload");
  }

  console.log("Backend auth and crisis unit tests passed successfully!");
}

runBackendTests();
