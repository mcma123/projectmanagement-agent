CopilotKit <> Mastra AG-UI Canvas Starter

Created by Innovation Imperial
Developed by McMarsh

This is a starter template for building AI-powered canvas applications using Mastra
 and CopilotKit
. It provides a modern Next.js application integrated with a Mastra agent that manages a visual canvas of interactive cards with real-time AI synchronization.

✨ Key Features

Visual Canvas Interface with responsive grid layout

Four Card Types:

Project — text fields, dropdown, date picker, checklist

Entity — text fields, dropdown, multi-select tags

Note — rich text area

Chart — visual metrics with percentage-based bars

Real-time AI Sync (bidirectional)

AI Multi-step Planning with visual progress

Human-in-the-Loop Clarification

Toggle Between Canvas & JSON View

Responsive Design with mobile chat UI

Mastra Integration with memory, tools, and model control

📌 Prerequisites

Node.js 18+

One of:

pnpm (recommended)

npm

yarn

bun

Note: Lock files are ignored to support multiple package managers.
Each developer generates their own lock file locally.

✈️ Getting Started
1️⃣ Add OpenAI API Key
echo "OPENAI_API_KEY=your-key-here" >> .env

2️⃣ Install Dependencies
# pnpm
pnpm install

# npm
npm install

# yarn
yarn install

# bun
bun install

3️⃣ Start Development Server
# pnpm
pnpm dev

# npm
npm run dev

# yarn
yarn dev

# bun
bun run dev


Runs both the UI and Mastra agent concurrently.

🖼️ Using the Canvas
Create Cards

“Create a new project”

“Add an entity and a note”

“Create a chart with sample metrics”

Edit Cards

“Set the project field1 to ‘Q1 Planning’”

“Update chart metrics”

“Add a checklist item ‘Review budget’”

Multi-Step Plans

“Create 3 projects with different priorities and add 2 checklist items to each”

JSON Mode

Toggle between the visual canvas and raw JSON state.

📜 Available Scripts

dev — frontend + agent in dev mode

dev:agent — agent only

dev:debug — verbose logs (LOG_LEVEL=debug)

build — production build

start — serve production

lint — ESLint

🏛️ Architecture Overview
graph TB
    subgraph "Frontend (Next.js)"
        UI[Canvas UI<br/>page.tsx]
        Actions[Frontend Actions<br/>useCopilotAction]
        State[State Management<br/>useCoAgent]
        Chat[CopilotChat]
    end
    
    subgraph "Integrated Backend"
        Runtime[CopilotKit Runtime<br/>api/copilotkit/route.ts]
        Agent[Mastra Agent<br/>agents/index.ts]
        Tools[Tools<br/>setPlan/updatePlan/completePlan]
        Schema[Zod Schema<br/>AgentState]
        Model[LLM<br/>GPT-4o-mini]
    end
    
    UI <--> State
    State <--> Runtime
    Chat <--> Runtime
    Actions --> Runtime
    Runtime <--> Agent
    Agent --> Tools
    Agent --> Schema
    Agent --> Model

🎨 Card Schema (Summary)

Project: text, select, date, checklist

Entity: text, select, tags

Note: textarea

Chart: metric label + value array

🔧 Customization Guide
➕ Adding New Card Types

Add schema — src/lib/canvas/types.ts

Add to CardType

Add UI — CardRenderer.tsx

Update agent — src/mastra/agents/index.ts

Add frontend actions — src/app/page.tsx

✏️ Modifying Existing Cards

Update schema and rendering logic

Adjust agent instructions

Ensure actions follow naming conventions

🧠 Agent Configuration

Controlled through src/mastra/agents/index.ts

Tools stored under src/mastra/tools

Memory defaults can be changed

LLM model override available

🛠️ Troubleshooting
Agent Connection Issues

Check OpenAI key in .env

Ensure registration in mastra/index.ts

Check terminal logs

Canvas Sync Issues

Check browser console

Verify actions registered

Ensure working memory isn't caching old state

Debug Logging
npm run dev:debug
