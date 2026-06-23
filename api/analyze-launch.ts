import type { VercelRequest, VercelResponse } from "@vercel/node";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are an expert in workflow automation for content operations at streaming companies like Netflix.

Your job is to analyze each step of a content launch workflow and classify it into exactly one of four automation tiers:

1. **Full Automation** — Repetitive, rule-based, low-stakes, high-volume. No human needs to see this.
2. **Human-in-Loop** — Agent does the work, but a human approves before any action is taken.
3. **Human Decides, Agent Executes** — The judgment call stays human (editorial, risk, strategy), but once decided, execution can be automated.
4. **Fully Human** — Creative judgment, editorial discretion, exception handling, stakeholder politics. Automating this would degrade quality or create risk.

Be honest about risk. A common mistake is over-automating steps that look routine but carry significant downstream blast radius.

Always return valid JSON and nothing else.`;

const USER_PROMPT_TEMPLATE = (steps: string) => `Analyze the following content launch workflow. Each line is a step.

For each step, return:
- stepNumber (1-indexed)
- step (exact text of the step)
- category: one of "Full Automation", "Human-in-Loop", "Human Decides, Agent Executes", "Fully Human"
- reasoning: 1-2 sentences. Be specific, not generic.
- riskFlag: describe the risk if this step were misclassified (automated when it shouldn't be, or kept manual when automation is safe). Return null if no significant risk.

Then produce a transformation roadmap: order the automatable steps by priority (impact x feasibility), group into phases, and explain dependencies.

Return this exact JSON structure:
{
  "steps": [
    {
      "stepNumber": 1,
      "step": "...",
      "category": "...",
      "reasoning": "...",
      "riskFlag": "..." | null
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "...",
      "steps": ["step text 1", "step text 2"],
      "action": "What to automate and how",
      "expectedImpact": "Specific impact — time saved, error rate reduction, etc.",
      "dependencies": ["what needs to be true first"]
    }
  ],
  "summary": "2-3 sentences on the overall automation opportunity and primary risk to watch."
}

Workflow steps:
${steps}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { steps } = req.body as { steps: string };

  if (!steps || steps.trim().length === 0) {
    return res.status(400).json({ error: "No workflow steps provided" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: USER_PROMPT_TEMPLATE(steps),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Anthropic API error:", errorBody);
      return res.status(502).json({ error: "Upstream API error", detail: errorBody });
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>;
    };

    const rawText = data.content[0]?.text ?? "";

    // Strip markdown code fences if present
    const jsonText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(jsonText);

    return res.status(200).json(parsed);
  } catch (err: unknown) {
    console.error("Handler error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({ error: "Analysis failed", detail: message });
  }
}
