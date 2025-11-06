'use client';

import { useMemo, useState } from "react";
import { generateWorkflow, type GeneratedWorkflow } from "@/lib/generator";

type FormState = {
  workflowName: string;
  prompt: string;
  timezone: string;
  includeNotes: boolean;
};

const DEFAULT_PROMPT =
  "When a new support ticket is created, fetch the customer's details, update the Notion CRM page, and post a summary to Slack.";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Singapore",
  "Australia/Sydney"
];

export function WorkflowBuilder() {
  const [form, setForm] = useState<FormState>({
    workflowName: "Natural Language n8n Flow",
    prompt: DEFAULT_PROMPT,
    timezone: "UTC",
    includeNotes: true
  });
  const [workflow, setWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const previewJson = useMemo(() => workflow?.json ?? "", [workflow]);

  const handleChange = (
    field: keyof FormState,
    value: string | boolean
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsGenerating(true);

    try {
      const result = generateWorkflow({
        workflowName: form.workflowName,
        prompt: form.prompt,
        timezone: form.timezone,
        includeNotes: form.includeNotes
      });
      setWorkflow(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to generate workflow.";
      setError(message);
    } finally {
      setIsGenerating(false);
      setCopied(false);
    }
  };

  const handleCopy = async () => {
    if (!workflow) return;
    try {
      await navigator.clipboard.writeText(workflow.json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!workflow) return;
    const blob = new Blob([workflow.json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${form.workflowName.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,480px)_1fr]">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-glow backdrop-blur">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Workflow name
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
              value={form.workflowName}
              onChange={(event) =>
                handleChange("workflowName", event.target.value)
              }
              placeholder="Support Ticket Enrichment"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Describe what the workflow should do
            </label>
            <textarea
              className="h-40 w-full resize-none rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
              value={form.prompt}
              onChange={(event) => handleChange("prompt", event.target.value)}
              placeholder="When..."
              minLength={10}
              required
            />
            <p className="mt-2 text-xs text-slate-400">
              Hints: mention data sources, destinations, schedules, HTTP APIs, or
              collaboration tools to guide the generator.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Workflow timezone
              </label>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-base text-white outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-400/40"
                value={form.timezone}
                onChange={(event) => handleChange("timezone", event.target.value)}
              >
                {TIMEZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 transition hover:border-brand-400 hover:bg-slate-900/60">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-slate-700 bg-slate-950 text-brand-400 focus:ring-brand-400/40"
                checked={form.includeNotes}
                onChange={(event) =>
                  handleChange("includeNotes", event.target.checked)
                }
              />
              Include helper notes on nodes
            </label>
          </div>

          {error ? (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-glow transition hover:bg-brand-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-brand-500/40"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate n8n JSON"}
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-950/40 p-8 backdrop-blur">
        <header>
          <h2 className="text-xl font-semibold text-white">
            Workflow preview
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Copy the JSON straight into n8n or download the file to import later.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-200 transition hover:bg-brand-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
            disabled={!workflow}
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-brand-400 hover:text-brand-200 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
            disabled={!workflow}
          >
            Download .json
          </button>
        </div>

        {workflow ? (
          <>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200">
              <p className="mb-3 text-xs uppercase tracking-wide text-brand-300">
                Nodes
              </p>
              <ul className="space-y-2">
                {workflow.nodes.map((node) => (
                  <li
                    key={node.name}
                    className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"
                  >
                    <p className="font-medium text-white">{node.name}</p>
                    <p className="text-xs text-slate-400">{node.summary}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-500">
                      {node.type}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/90">
              <pre className="h-80 overflow-auto p-4 text-xs leading-relaxed text-brand-100">
                <code>{previewJson}</code>
              </pre>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/20 p-10 text-center text-slate-500">
            <p className="text-sm font-medium">
              Generate a workflow to see the resulting JSON structure here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
