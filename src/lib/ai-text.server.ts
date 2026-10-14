import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const MODEL = "openai/gpt-6-astra";

export class AiGatewayError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Streams one Responses call through Lovable AI Gateway and returns the final text. */
export async function writeText(instructions: string, prompt: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiGatewayError(401, "AI nuk është konfiguruar.");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  let failure: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    instructions,
    messages: [{ role: "user", content: prompt }],
    maxRetries: 0,
    onError: ({ error }) => {
      failure = error;
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  let text = "";
  try {
    text = (await result.text).trim();
  } catch (e) {
    failure ??= e;
  }
  if (failure || !text) {
    const status = (failure as { statusCode?: number } | undefined)?.statusCode ?? 500;
    console.error("AI gateway call failed", status, failure);
    if (status === 402) throw new AiGatewayError(402, "Kreditet e AI kanë mbaruar. Provoni më vonë.");
    if (status === 429) throw new AiGatewayError(429, "Shumë kërkesa njëherësh. Provoni pas pak.");
    if (status === 403) throw new AiGatewayError(403, "AI nuk lejohet për këtë kërkesë.");
    throw new AiGatewayError(status, "Teksti nuk u krijua. Provoni përsëri.");
  }
  return text;
}
