import { secret } from "encore.dev/config";

const sPOE = secret("POE_API_KEY");
const sOPENAI_BASE = secret("OPENAI_BASE_URL");
const sOPENAI_KEY = secret("OPENAI_API_KEY");

export function getPoeApiKey(): string | undefined {
  return sPOE() || process.env.POE_API_KEY;
}

export function getOpenAIConfig(): { baseUrl?: string; apiKey?: string } {
  const baseUrl = sOPENAI_BASE() || process.env.OPENAI_BASE_URL;
  const apiKey = sOPENAI_KEY() || process.env.OPENAI_API_KEY;
  return { baseUrl, apiKey };
}

