import { createSpeechmaticsJWT } from "@speechmatics/auth";

// WARNING: This function is used for the purpose of this example only.
// In a real-world scenario, you should not expose your API key in your client-side code.
// Instead, you should create a server-side endpoint that generates the JWT for you.
export async function getJWT() {
  // EXPO_PUBLIC_SPEECHMATICS_API_KEY could be set in your .env file
  const apiKey = process.env.EXPO_PUBLIC_SPEECHMATICS_API_KEY;

  if (!apiKey) {
    throw new Error("API key is required.");
  }
  return await createSpeechmaticsJWT({
    type: "rt",
    apiKey,
    ttl: 60, // 1 minute
  });
}
