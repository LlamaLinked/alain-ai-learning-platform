import { api, APIError } from "encore.dev/api";
import { requireUserId } from "../auth";
import type { ExecuteRequest, Provider as ExecProvider } from "./providers";
import { poeProvider, openAIProvider } from "./providers";

interface ExecuteResponse {
  success: boolean;
  content?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Executes LLM requests and returns the complete response.
export const execute = api<ExecuteRequest, ExecuteResponse>(
  { expose: true, method: "POST", path: "/execute" },
  async (req, ctx) => {
    try {
      await requireUserId(ctx);
      const provider = getProvider(req.provider);
      const content = await provider.execute(req);
      return { success: true, content };
    } catch (error) {
      const errorData = mapProviderError(error);
      return { success: false, error: errorData };
    }
  }
);

// Teacher model router for lesson generation using GPT-OSS models
export const teacherExecute = api<ExecuteRequest, ExecuteResponse>(
  { expose: true, method: "POST", path: "/teacher/execute" },
  async (req) => {
    try {
      // Force Poe provider and restrict to GPT-OSS teacher models
      const teacherReq: ExecuteRequest = { ...req, provider: "poe" };

      if (!req.model || !req.model.toLowerCase().includes("gpt-oss")) {
        teacherReq.model = "GPT-OSS-20B";
      } else if (req.model !== "GPT-OSS-20B" && req.model !== "GPT-OSS-120B") {
        teacherReq.model = "GPT-OSS-20B";
      }

      // Harmony-leaning params
      teacherReq.temperature = req.temperature ?? 0.3;
      teacherReq.max_tokens = req.max_tokens ?? 2048;

      const provider = getProvider(teacherReq.provider);
      const content = await provider.execute(teacherReq);
      return { success: true, content };
    } catch (error) {
      const errorData = mapProviderError(error);
      return { success: false, error: errorData };
    }
  }
);

function getProvider(providerName: ExecuteRequest["provider"]): ExecProvider {
  switch (providerName) {
    case "poe":
      return poeProvider;
    case "openai-compatible":
      return openAIProvider;
    default:
      throw APIError.invalidArgument("unsupported provider");
  }
}

function mapProviderError(error: any): { code: string; message: string; details?: any } {
  if (error instanceof APIError) {
    return {
      code: getCodeFromAPIError(error),
      message: error.message
    };
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('fetch') || message.includes('network') || message.includes('connect') || message.includes('econnreset')) {
      return {
        code: "connection_error",
        message: "Unable to connect to the AI provider. Please check your internet connection and try again."
      };
    }
    
    if (message.includes('timeout') || message.includes('aborted')) {
      return {
        code: "timeout",
        message: "The request took too long to complete. Please try again with a shorter prompt or different parameters."
      };
    }

    if (message.includes('401') || message.includes('unauthorized') || message.includes('authentication')) {
      return {
        code: "authentication_failed",
        message: "Authentication failed. Please check your API key configuration."
      };
    }

    if (message.includes('429') || message.includes('rate limit')) {
      return {
        code: "rate_limited",
        message: "Too many requests. Please wait a moment before trying again."
      };
    }

    if (message.includes('404') || message.includes('model')) {
      return {
        code: "model_not_found",
        message: "The specified AI model is not available. Please try a different model."
      };
    }

    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
      return {
        code: "provider_unavailable",
        message: "The AI provider is temporarily unavailable. Please try again in a few moments."
      };
    }
    
    return {
      code: "unknown_error",
      message: "An unexpected error occurred. Please try again."
    };
  }
  
  return {
    code: "internal_error",
    message: "An internal error occurred. Please try again."
  };
}

function getCodeFromAPIError(error: APIError): string {
  const errorCode = (error as any).code;
  switch (errorCode) {
    case "unauthenticated":
      return "authentication_failed";
    case "not_found":
      return "model_not_found";
    case "resource_exhausted":
      return "rate_limited";
    case "deadline_exceeded":
      return "timeout";
    case "failed_precondition":
      return "configuration_error";
    case "invalid_argument":
      return "invalid_request";
    default:
      return "internal_error";
  }
}

