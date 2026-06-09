import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

// ─── Types ────────────────────────────────────────────────────────────────────

type AutomationCategory =
  | "Full Automation"
  | "Human-in-Loop"
  | "Human Decides, Agent Executes"
  | "Fully Human";

interface StepAnalysis {
  stepNumber: number;
  step: string;
  category: AutomationCategory;
  reasoning: string;
  riskFlag: string | null;
}

interface RoadmapPhase {
  phase: number;
  title: string;
  steps: string[];
  action: string;
  expectedImpact: string;
  dependencies: string[];
}

interface AnalysisResult {
  steps: StepAnalysis[];
  roadmap: RoadmapPhase[];
  summary: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  AutomationCategory,
  { color: string; bg: string; border: string; dot: string; label: string }
> = {
  "Full Automation": {
    color: "text-emerald-400",
    bg: "bg-emerald-950/60",
    border: "border-emerald-700/50",
    dot: "bg-emerald-400",
    label: "Full Auto",
  },
  "Human-in-Loop": {
    color: "text-sky-400",
    bg: "bg-sky-950/60",
    border: "border-sky-700/50",
    dot: "bg-sky-400",
    label: "Human-in-Loop",
  },
  "Human Decides, Agent Executes": {
    color: "text-amber-400",
    bg: "bg-amber-950/60",
    border: "border-amber-700/50",
    dot: "bg-amber-400",
    label: "Human Decides",
  },
  "Fully Human": {
    color: "text-rose-400",
    bg: "bg-rose-950/60",
    border: "border-rose-700/50",
    dot: "bg-rose-400",
    label: "Fully Human",
  },
};

const EXAMPLE_WORKFLOW = `Content brief created by development team
Asset metadata ingested from production system
Title, description, and genre tags populated
Legal and compliance check for regional restrictions
Subtitle files uploaded for 12 languages
Subtitle quality review for tone, accuracy, and timing
Thumbnail options generated from frame extraction
Thumbnail selected for each regional market
Scheduled publish date confirmed by content acquisition
Content availability windows configured per territory
Push notification copy written for new release
Marketing campaign linked to content card
Go-live triggered and availability confirmed across CDN
Post-launch viewership anomaly check (first 2 hours)
Executive summary email sent to stakeholders`;

// ─── Legend ───────────────────────────────────────────────────────────────────

const Legend = () => (
  <div className="flex flex-wrap gap-3 mb-8">
    {(Object.entries(CATEGORY_CONFIG) as [AutomationCategory, typeof CATEGORY_CONFIG[AutomationCategory]][]).map(
      ([key, cfg]) => (
        <div
          key={key}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium",
            cfg.bg,
            cfg.border,
            cfg.color
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", cfg.dot)} />
          {key}
        </div>
      )
    )}
  </div>
);

// ─── Step Card ────────────────────────────────────────────────────────────────

const StepCard = ({ step, index }: { step: StepAnalysis; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = CATEGORY_CONFIG[step.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={cn(
        "rounded-xl border p-4 cursor-pointer transition-all duration-200",
        cfg.bg,
        cfg.border,
        "hover:brightness-110"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <span className="text-gray-500 dark:text-gray-600 text-xs font-mono mt-0.5 w-5 flex-shrink-0">
          {String(step.stepNumber).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sm font-medium dark:text-gray-100 text-gray-800 leading-snug">
              {step.step}
            </p>
            <span
              className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full border flex-shrink-0",
                cfg.color,
                cfg.border,
                cfg.bg
              )}
            >
              {cfg.label}
            </span>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                  <p className="text-xs dark:text-gray-300 text-gray-600 leading-relaxed">
                    <span className="font-semibold dark:text-gray-200 text-gray-700">Reasoning: </span>
                    {step.reasoning}
                  </p>
                  {step.riskFlag && (
                    <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-orange-950/40 border border-orange-700/40">
                      <span className="text-orange-400 flex-shrink-0 mt-0.5">⚠</span>
                      <p className="text-xs text-orange-300 leading-relaxed">
                        <span className="font-semibold">Risk if misclassified: </span>
                        {step.riskFlag}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className={cn("text-xs mt-0.5 flex-shrink-0 transition-transform", expanded && "rotate-180")}>
          ▾
        </span>
      </div>
    </motion.div>
  );
};

// ─── Distribution Bar ─────────────────────────────────────────────────────────

const DistributionBar = ({ steps }: { steps: StepAnalysis[] }) => {
  const counts: Record<AutomationCategory, number> = {
    "Full Automation": 0,
    "Human-in-Loop": 0,
    "Human Decides, Agent Executes": 0,
    "Fully Human": 0,
  };
  steps.forEach((s) => counts[s.category]++);
  const total = steps.length;

  return (
    <div className="mb-8">
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
        {(Object.entries(counts) as [AutomationCategory, number][])
          .filter(([, count]) => count > 0)
          .map(([cat, count]) => (
            <div
              key={cat}
              className={cn(CATEGORY_CONFIG[cat].dot, "transition-all duration-500")}
              style={{ width: `${(count / total) * 100}%` }}
              title={`${cat}: ${count} steps`}
            />
          ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {(Object.entries(counts) as [AutomationCategory, number][]).map(([cat, count]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className={cn("w-2 h-2 rounded-full", CATEGORY_CONFIG[cat].dot)} />
            <span className="text-xs dark:text-gray-400 text-gray-500">
              {cat}: <span className="font-semibold dark:text-gray-200 text-gray-700">{count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Roadmap Phase Card ───────────────────────────────────────────────────────

const PhaseCard = ({ phase, index }: { phase: RoadmapPhase; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.3 }}
    className="rounded-xl border border-gray-700/50 dark:bg-gray-900/60 bg-white/80 p-5"
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {phase.phase}
      </span>
      <h4 className="font-semibold dark:text-gray-100 text-gray-800 text-sm">{phase.title}</h4>
    </div>

    <div className="space-y-3 text-xs">
      <div>
        <p className="text-gray-500 dark:text-gray-500 font-medium mb-1 uppercase tracking-wider text-[10px]">
          Steps
        </p>
        <ul className="space-y-1">
          {phase.steps.map((s, i) => (
            <li key={i} className="dark:text-gray-300 text-gray-600 flex gap-2">
              <span className="text-red-500 flex-shrink-0">›</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-gray-500 dark:text-gray-500 font-medium mb-1 uppercase tracking-wider text-[10px]">
          Action
        </p>
        <p className="dark:text-gray-300 text-gray-600 leading-relaxed">{phase.action}</p>
      </div>

      <div>
        <p className="text-gray-500 dark:text-gray-500 font-medium mb-1 uppercase tracking-wider text-[10px]">
          Expected Impact
        </p>
        <p className="text-emerald-400 leading-relaxed">{phase.expectedImpact}</p>
      </div>

      {phase.dependencies.length > 0 && (
        <div>
          <p className="text-gray-500 dark:text-gray-500 font-medium mb-1 uppercase tracking-wider text-[10px]">
            Dependencies
          </p>
          <ul className="space-y-1">
            {phase.dependencies.map((d, i) => (
              <li key={i} className="dark:text-gray-400 text-gray-500">
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </motion.div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

const LaunchAnalyzer = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze-launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps: input }),
      });

      if (!res.ok) {
        const errData = await res.json() as { error?: string };
        throw new Error(errData.error ?? `Request failed: ${res.status}`);
      }

      const data = await res.json() as AnalysisResult;
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Analysis failed. Check your configuration.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => setInput(EXAMPLE_WORKFLOW);
  const reset = () => {
    setResult(null);
    setError(null);
    setInput("");
  };

  return (
    <div className="min-h-screen dark:bg-black bg-mainColor pt-24 pb-16">
      <div className={cn(maxWidth, "py-8")}>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono text-red-500 uppercase tracking-widest">
              Launch Ops Tool
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold dark:text-white text-gray-900 mb-3 leading-tight">
            Launch Process Analyzer
          </h1>
          <p className="dark:text-gray-400 text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">
            Paste any multi-step content launch workflow. The analyzer classifies each step into an
            automation tier, flags misclassification risk, and outputs a sequenced transformation roadmap.
          </p>
          <p className="mt-2 dark:text-gray-500 text-gray-400 text-xs">
            Built for content ops teams mapping which workflow steps to agentify vs keep human-in-loop.
          </p>
        </div>

        {/* Tier legend */}
        <Legend />

        {/* Input panel */}
        {!result && (
          <div className="rounded-2xl border border-gray-700/50 dark:bg-gray-900/40 bg-white/60 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold dark:text-gray-200 text-gray-700">
                Workflow steps
              </label>
              <button
                onClick={loadExample}
                className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Load example (Netflix-style launch)
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Paste one step per line. For example:\n\nContent brief created by development team\nAsset metadata ingested from production system\nLegal and compliance check for regional restrictions\n...`}
              className={cn(
                "w-full h-64 resize-none rounded-xl p-4 text-sm font-mono leading-relaxed",
                "dark:bg-gray-800/60 bg-gray-50 dark:text-gray-200 text-gray-700",
                "dark:border-gray-700 border border-gray-300",
                "focus:outline-none focus:ring-2 focus:ring-red-500/40",
                "placeholder:dark:text-gray-600 placeholder:text-gray-400"
              )}
            />
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs dark:text-gray-600 text-gray-400">
                {input.trim().split("\n").filter((l) => l.trim()).length} steps detected
              </p>
              <button
                onClick={analyze}
                disabled={loading || !input.trim()}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                  "bg-red-600 hover:bg-red-500 text-white",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:-translate-y-px active:translate-y-px"
                )}
              >
                {loading ? "Analyzing..." : "Analyze Workflow"}
              </button>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-red-500"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.12, repeat: Infinity }}
                />
              ))}
            </div>
            <p className="text-sm dark:text-gray-400 text-gray-500">Classifying steps and building roadmap...</p>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-rose-700/50 bg-rose-950/30 p-5 mb-6">
            <p className="text-rose-400 text-sm font-medium mb-1">Analysis failed</p>
            <p className="text-rose-300/70 text-xs">{error}</p>
            <button
              onClick={reset}
              className="mt-3 text-xs text-rose-400 hover:text-rose-300 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Summary */}
            <div className="rounded-xl border border-gray-700/50 dark:bg-gray-900/40 bg-white/60 p-5 mb-8">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-2">
                Summary
              </p>
              <p className="dark:text-gray-200 text-gray-700 text-sm leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Distribution */}
            <DistributionBar steps={result.steps} />

            {/* Steps */}
            <div className="mb-10">
              <h2 className="text-lg font-bold dark:text-white text-gray-900 mb-4">
                Step Classification
              </h2>
              <p className="text-xs dark:text-gray-500 text-gray-400 mb-4">
                Click any step to expand reasoning and risk flags.
              </p>
              <div className="space-y-2">
                {result.steps.map((step, i) => (
                  <StepCard key={step.stepNumber} step={step} index={i} />
                ))}
              </div>
            </div>

            {/* Roadmap */}
            {result.roadmap.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-bold dark:text-white text-gray-900 mb-2">
                  Transformation Roadmap
                </h2>
                <p className="text-xs dark:text-gray-500 text-gray-400 mb-5">
                  Sequenced by impact x feasibility. Each phase assumes the previous is complete.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.roadmap.map((phase, i) => (
                    <PhaseCard key={phase.phase} phase={phase} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Reset */}
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="px-6 py-2.5 rounded-full text-sm font-medium dark:text-gray-400 text-gray-500 border dark:border-gray-700 border-gray-300 hover:dark:text-gray-200 hover:text-gray-700 transition-all duration-200"
              >
                Analyze another workflow
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LaunchAnalyzer;
