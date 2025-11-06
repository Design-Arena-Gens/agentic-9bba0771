import { WorkflowBuilder } from "@/components/workflow-builder";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 pb-16 pt-20">
      <header className="space-y-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900/60 to-slate-950 p-12 shadow-lg shadow-brand-900/20">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-200">
          n8n workflow architect
        </span>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Turn natural language into executable n8n JSON.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Describe your automation in plain English and instantly receive a
          structured, import-ready JSON workflow for n8n. No trial-and-error
          composition necessary.
        </p>
      </header>

      <WorkflowBuilder />

      <footer className="mt-auto border-t border-slate-900/60 pt-6 text-sm text-slate-500">
        Crafted with care for builders who want to ship faster. Replace nodes or
        tweak parameters directly in n8n after import.
      </footer>
    </main>
  );
}
