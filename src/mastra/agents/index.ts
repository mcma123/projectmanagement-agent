// Use AI SDK v4-style provider factory for Google (LanguageModelV1)
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import { Memory } from "@mastra/memory";
import { completePlan, setPlan, updatePlanProgress } from "@/mastra/tools";

// Create a Google provider instance (v4 pattern)
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

// Canvas Agent working memory schema mirrors the front-end AgentState
export const AgentState = z.object({
  // Avoid z.any() to ensure valid JSON schema for OpenAI tools
  // Use a permissive object so the array has a defined 'items' schema
  items: z
    .array(
      z
        .object({ id: z.string().optional() })
        .passthrough()
    )
    .default([]),
  globalTitle: z.string().default(""),
  globalDescription: z.string().default(""),
  lastAction: z.string().default(""),
  itemsCreated: z.number().int().default(0),
  planSteps: z.array(z.object({
    title: z.string(),
    status: z.enum(["pending", "in_progress", "completed", "blocked", "failed"]),
    note: z.string().optional(),
  })).default([]),
  currentStepIndex: z.number().int().default(-1),
  planStatus: z.string().default(""),
});

export const canvasAgent = new Agent({
  name: "sample_agent",
  description: "Canvas agent powering CopilotKit AG-UI interactions.",
  tools: { setPlan, updatePlanProgress, completePlan },
  // Switch to an AI SDK v4-compatible Gemini model to use legacy stream()
  model: google("gemini-1.5-flash"),
  instructions: "You are a helpful assistant managing a canvas of items. Prefer shared state over chat history.",
  memory: new Memory({
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentState,
      },
    },
  }),
});
