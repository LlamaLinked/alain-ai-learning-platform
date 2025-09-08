"use client";
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import PillInput from "@/components/PillInput";

export default function StreamDemo() {
  const [prompt, setPrompt] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    setOut("");
    setLoading(true);
    try {
      const resp = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "openai-compatible",
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt.trim() }],
          stream: true,
        }),
      });
      if (!resp.ok || !resp.body) throw new Error("request failed");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n\n")) !== -1) {
          const chunk = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const line = chunk.trim();
          if (!line) continue;
          if (line.startsWith("data:")) {
            const dataStr = line.slice(5).trim();
            if (dataStr === "[DONE]") break;
            try {
              const json = JSON.parse(dataStr);
              const delta = json?.choices?.[0]?.delta?.content ?? json?.choices?.[0]?.message?.content ?? "";
              setOut((prev) => prev + (delta || ""));
            } catch {}
          }
        }
      }
    } catch (e: any) {
      setOut(`Error: ${e?.message || String(e)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-0px)] overflow-hidden">
      {/* Soft gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,200,200,0.45),rgba(255,200,200,0)_60%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,220,255,0.45),rgba(200,220,255,0)_60%)] blur-3xl" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,255,230,0.35),rgba(200,255,230,0)_60%)] blur-3xl" />
      </div>

      {/* Sidebar + Main */}
      <div className="grid min-h-[inherit] grid-cols-1 md:grid-cols-[260px_1fr]">
        {/* Sidebar (optional scaffold) */}
        <aside className="hidden border-r bg-white/40 p-4 backdrop-blur md:block">
          <nav className="space-y-1 text-sm text-gray-700">
            <div className="mb-2 font-semibold text-gray-800">ALAIN</div>
            <Link className="block rounded-lg px-3 py-2 hover:bg-black/5" href="/">New notebook</Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-black/5" href="/tutorials">My tutorials</Link>
            <Link className="block rounded-lg px-3 py-2 hover:bg-black/5" href="/stream">Stream playground</Link>
          </nav>
        </aside>

        {/* Main panel */}
        <main className="px-6 py-8 md:py-12">
          <h1 className="text-center text-3xl font-semibold md:text-4xl">Stream Playground</h1>
          <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">
            Try a prompt below. Output streams in real time.
          </p>

          <div className="mx-auto mt-8 max-w-3xl">
            <SignedOut>
              <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white/70 p-4 text-center backdrop-blur">
                <p className="mb-2 text-sm">Please sign in to run the demo.</p>
                <SignInButton />
              </div>
            </SignedOut>

            <SignedIn>
              <PillInput
                className="mb-3 max-w-3xl"
                value={prompt}
                onChange={setPrompt}
                onSubmit={run}
                placeholder="Ask anything (the output appears below)…"
                submitLabel={loading ? 'Running' : 'Run'}
                loading={loading}
                valid={prompt.trim().length > 0}
              />

              <section className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">{out}</pre>
              </section>
            </SignedIn>
          </div>
        </main>
      </div>
    </div>
  );
}
