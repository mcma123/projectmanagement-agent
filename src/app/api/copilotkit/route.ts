import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MastraAgent } from "@ag-ui/mastra"
import { NextRequest } from "next/server";
import { mastra } from "@/mastra";

// 1. You can use any service adapter here for multi-agent support.
const serviceAdapter = new ExperimentalEmptyAdapter();

// 2. Build a Next.js API route that handles the CopilotKit runtime requests.
export const POST = async (req: NextRequest) => {

  // 3. Create the CopilotRuntime instance and utilize the Mastra AG-UI
  //    integration to get the remote agents. Cache this for performance.
  const agents = MastraAgent.getLocalAgents({ mastra });

  // Warn early if server model key is missing
  if (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.warn(
      "[CopilotKit] Missing LLM key in server env; set OPENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY in .env.local and restart."
    );
  }

  // Use agents as-is; for AI SDK v4 providers, legacy stream() is supported.
  const runtime = new CopilotRuntime({ agents });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
 
  return handleRequest(req);
};

// Health check and diagnostics for /api/copilotkit
export const GET = async () => {
  // Build agents the same way as POST to surface availability
  const agents = MastraAgent.getLocalAgents({ mastra });
  const agentNames = Object.keys(agents || {});

  // Minimal privacy-preserving env diagnostics
  const openaiKeyPresent = !!process.env.OPENAI_API_KEY;
  const googleKeyPresent = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // Check if agents support streamVNext (required for V2 models like Gemini)
  const supportsVNext = agentNames.some((n) => {
    const a: any = (agents as any)?.[n];
    return a && typeof a.streamVNext === "function";
  });

  // Check for V2 model usage (like Gemini 2.5 Flash)
  const usesV2Models = agentNames.some((n) => {
    const a: any = (agents as any)?.[n];
    try {
      const modelId = a?.model?.modelId || a?.model?.model || '';
      return modelId.includes('gemini') || modelId.includes('2.5');
    } catch {
      return false;
    }
  });

  return new Response(
    JSON.stringify({
      status: "ok",
      agents: agentNames,
      openaiKeyPresent,
      googleKeyPresent,
      streamVNextSupported: supportsVNext,
      usesV2Models,
      v2ModelSupport: supportsVNext && usesV2Models,
      note: supportsVNext && usesV2Models
        ? "V2 model support enabled with streamVNext. Gemini 2.5 Flash should work correctly."
        : !supportsVNext
        ? "streamVNext not supported - V2 models like Gemini 2.5 Flash will not work."
        : googleKeyPresent || openaiKeyPresent
        ? "API keys present. If you still see no responses, check model availability and server logs."
        : "Missing API keys. Add OPENAI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY to .env.local and restart.",
    }),
    { headers: { "content-type": "application/json" } }
  );
};
