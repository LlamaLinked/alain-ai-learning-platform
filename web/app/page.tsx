"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [hfUrl, setHfUrl] = useState("");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string>("");
  const [preview, setPreview] = useState<{
    id: string;
    sha?: string;
    pipeline_tag?: string;
    likes?: number;
    downloads?: number;
    tags?: string[];
    private?: boolean;
    author?: string;
    cardData?: { language?: string | string[]; license?: string; library_name?: string } | null;
    createdAt?: string;
    lastModified?: string;
    description?: string;
  } | null>(null);
  const previewAbortRef = useRef<AbortController | null>(null);
  const previewDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Extract and validate the input (HF URL or model id), returning a normalized model id on success
  const validateHfInput = (input: string): { valid: boolean; modelId?: string; message?: string } => {
    const raw = input.trim();
    if (!raw) return { valid: false, message: "Please enter a Hugging Face URL or model id." };

    // Full URL case: https://huggingface.co/org/model[/...]
    const urlMatch = raw.match(/^https?:\/\/(?:www\.)?huggingface\.co\/(.+)$/i);
    if (urlMatch) {
      // Take the first two segments as org/model
      const path = urlMatch[1].replace(/^models\//, "");
      const parts = path.split("/").filter(Boolean);
      if (parts.length >= 2) {
        const modelId = `${parts[0]}/${parts[1]}`;
        return { valid: true, modelId };
      }
      return { valid: false, message: "Could not parse model id from URL. Expecting /org/model." };
    }

    // Plain model id: org/model with allowed characters
    const plainRe = /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9][A-Za-z0-9._-]*$/;
    if (plainRe.test(raw)) {
      return { valid: true, modelId: raw };
    }
    return { valid: false, message: "Invalid format. Use ‘org/model’ or a full Hugging Face URL." };
  };

  const parsed = useMemo(() => validateHfInput(hfUrl), [hfUrl]);
  const isValidInput = parsed.valid;
  const normalizedModelId = parsed.valid ? parsed.modelId! : "";

  // Debounced fetch of model metadata for preview
  useEffect(() => {
    // Clear previous debounce
    if (previewDebounceRef.current) {
      clearTimeout(previewDebounceRef.current);
      previewDebounceRef.current = null;
    }
    // Abort any in-flight request
    if (previewAbortRef.current) {
      previewAbortRef.current.abort();
      previewAbortRef.current = null;
    }

    setPreviewError("");
    if (!isValidInput) {
      setPreview(null);
      setPreviewLoading(false);
      return;
    }

    previewDebounceRef.current = setTimeout(async () => {
      try {
        setPreviewLoading(true);
        const ctrl = new AbortController();
        previewAbortRef.current = ctrl;
        const res = await fetch(`https://huggingface.co/api/models/${encodeURIComponent(normalizedModelId)}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) {
          if (res.status === 404) throw new Error("Model not found on Hugging Face");
          throw new Error(`Failed to load model info (status ${res.status})`);
        }
        const info = await res.json();
        // Compose a friendly description
        let description: string | undefined = undefined;
        if (typeof info?.cardData?.description === "string") description = info.cardData.description;
        else if (typeof info?.description === "string") description = info.description;

        setPreview({
          id: info?.modelId || normalizedModelId,
          sha: info?.sha,
          pipeline_tag: info?.pipeline_tag,
          likes: info?.likes,
          downloads: info?.downloads,
          tags: Array.isArray(info?.tags) ? info.tags.slice(0, 20) : undefined,
          private: info?.private,
          author: info?.author,
          cardData: info?.cardData ?? null,
          createdAt: info?.createdAt,
          lastModified: info?.lastModified,
          description,
        });
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setPreview(null);
        setPreviewError(e?.message || "Could not load model info");
      } finally {
        setPreviewLoading(false);
      }
    }, 400);

    return () => {
      if (previewDebounceRef.current) clearTimeout(previewDebounceRef.current);
      if (previewAbortRef.current) previewAbortRef.current.abort();
    };
  }, [isValidInput, normalizedModelId]);

  const friendlyError = (msg: string): string => {
    const m = msg.toLowerCase();
    if (m.includes("not found") || m.includes("404")) return "Model not found. Check the organization/name spelling.";
    if (m.includes("rate") && m.includes("limit")) return "Rate limited by upstream. Please retry in a moment.";
    if (m.includes("invalid") && m.includes("url")) return "That doesn’t look like a valid HF URL or model id.";
    return msg || "Something went wrong. Please try again.";
  };
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hfUrl.trim()) return;

    setLoading(true);
    setLoadingStep("Validating input...");
    setError("");

    const v = validateHfInput(hfUrl);
    if (!v.valid) {
      setError(v.message || "Invalid input");
      setLoading(false);
      setLoadingStep("");
      return;
    }

    setLoadingStep("Generating lesson...");

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hfUrl: v.modelId, difficulty }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate lesson" }));
        throw new Error(errorData.error?.message || "Failed to generate lesson");
      }

      setLoadingStep("Saving tutorial...");
      const data = await response.json();
      if (data.success && data.tutorialId) {
        router.push(`/tutorial/${data.tutorialId}`);
      } else {
        throw new Error("Failed to create tutorial");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(friendlyError(msg));
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-0px)] overflow-hidden">
      {/* Soft gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,200,200,0.45),rgba(255,200,200,0)_60%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,220,255,0.45),rgba(200,220,255,0)_60%)] blur-3xl" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,255,230,0.35),rgba(200,255,230,0)_60%)] blur-3xl" />
      </div>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Generate an ALAIN Notebook</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500 md:mt-4 md:text-lg">
          Paste a Hugging Face URL or model id to create an interactive learning notebook.
        </p>

        <SignedOut>
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-gray-200 bg-white/70 p-4 text-center backdrop-blur">
            <p className="mb-2 text-sm">Sign in to generate your first lesson</p>
            <div className="flex justify-center gap-3"><SignInButton /><SignUpButton /></div>
          </div>
        </SignedOut>

        <SignedIn>
          <form onSubmit={handleSubmit} className="mx-auto mb-4 mt-8 max-w-3xl">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-5 py-4 shadow-sm backdrop-blur ring-1 ring-black/5">
              <span className="select-none text-gray-400">+</span>
              <input
                type="text"
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
                value={hfUrl}
                onChange={(e) => setHfUrl(e.target.value)}
                placeholder="Paste HF URL or org/model (e.g., meta-llama/Llama-2-7b-chat-hf)"
                disabled={loading}
              />
              <div className="mx-1 hidden h-6 w-px bg-gray-200 md:block" />
              <button
                type="submit"
                disabled={loading || !isValidInput}
                className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${loading || !isValidInput ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? (loadingStep || 'Generating…') : 'Generate'}
              </button>
            </div>
            <div className="mx-auto mt-3 flex flex-wrap items-center justify-center gap-3">
              <label htmlFor="difficulty" className="text-sm font-medium text-gray-600">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                disabled={loading}
                className="rounded-full border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {!isValidInput && hfUrl.trim().length > 0 && (
                <span className="text-sm text-red-500">Invalid format. Try org/model or a HF URL.</span>
              )}
            </div>
          </form>

          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

          {/* Model preview card */}
          {(previewLoading || preview || previewError) && (
            <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-gray-200 bg-white/80 p-4 text-left shadow-sm">
              {previewLoading && <p className="m-0 text-gray-500">Fetching model information…</p>}
              {!previewLoading && previewError && (
                <p className="m-0 text-red-500">{previewError}</p>
              )}
              {!previewLoading && preview && (
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold">{preview.id}</div>
                      {preview.pipeline_tag && (
                        <div className="text-sm text-gray-500">{preview.pipeline_tag}</div>
                      )}
                    </div>
                    {typeof preview.likes === 'number' && (
                      <div title="Likes" className="text-sm text-gray-500">❤ {preview.likes}</div>
                    )}
                  </div>
                  {preview.description && (
                    <p className="mt-2 whitespace-pre-line text-gray-700">
                      {preview.description.length > 300 ? preview.description.slice(0, 300) + '…' : preview.description}
                    </p>
                  )}
                  {preview?.tags && preview.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {preview.tags.slice(0, 8).map((t) => (
                        <span key={t} className="rounded-full border border-gray-200 bg-white px-2 py-1 text-xs">{t}</span>
                      ))}
                    </div>
                  )}
                  {preview.private && (
                    <p className="mt-2 text-red-500">This model is private. You may need authorization.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick picks for popular models */}
          <div className="mt-5">
            <p className="mb-2 text-sm text-gray-500">Try one of these popular models:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "gpt2",
                "bert-base-uncased",
                "meta-llama/Llama-2-7b-chat-hf",
                "mistralai/Mistral-7B-v0.1",
                "tiiuae/falcon-7b-instruct",
              ].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setHfUrl(m.includes("/") ? m : `huggingface.co/${m}`)}
                  disabled={loading}
                  className={`rounded-full border border-gray-200 bg-white px-3 py-1 text-sm ${loading ? 'cursor-not-allowed opacity-60' : 'hover:bg-gray-50'}`}
                  title={`Use ${m}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-5 text-sm text-gray-500">Examples: huggingface.co/microsoft/DialoGPT-medium, meta-llama/Llama-2-7b-chat-hf</p>
        </SignedIn>
      </section>
    </div>
  );
}
