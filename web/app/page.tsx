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
    <div style={{ padding: 24 }}>
      <section style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontSize: 48, lineHeight: 1.1, margin: 0, marginBottom: 16 }}>
          Learn AI by Doing
        </h1>
        <p style={{ color: "#9CA3AF", fontSize: 18, marginBottom: 32 }}>
          Generate interactive lessons from any Hugging Face model. Paste a URL or model name to get started.
        </p>

        <SignedOut>
          <p style={{ marginBottom: 20 }}>Sign in to generate your first lesson:</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <SignInButton />
            <SignUpButton />
          </div>
        </SignedOut>

        <SignedIn>
          <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                value={hfUrl}
                onChange={(e) => setHfUrl(e.target.value)}
                placeholder="Paste Hugging Face URL or model name (e.g., microsoft/DialoGPT-medium)"
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: 18,
                  border: "2px solid #E5E7EB",
                  borderRadius: 8,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                disabled={loading}
              />
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
              <label htmlFor="difficulty" style={{ fontWeight: 600 }}>Difficulty:</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
                disabled={loading}
                style={{ padding: "10px 12px", fontSize: 16, border: "2px solid #E5E7EB", borderRadius: 8 }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              {!isValidInput && hfUrl.trim().length > 0 && (
                <span style={{ color: "#EF4444", fontSize: 14 }}>
                  Invalid format. Try org/model or a HF URL.
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !isValidInput}
              style={{
                padding: "16px 32px",
                fontSize: 18,
                background: loading ? "#9CA3AF" : "#2563EB",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {loading ? (loadingStep || "Generating Lesson...") : "Generate ALAIN Notebook"}
            </button>
          </form>

          {error && (
            <p style={{ color: "#EF4444", marginTop: 16 }}>
              {error}
            </p>
          )}

          {/* Model preview card */}
          {(previewLoading || preview || previewError) && (
            <div style={{
              marginTop: 16,
              padding: 16,
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              textAlign: "left",
              background: "#FAFAFA",
            }}>
              {previewLoading && <p style={{ color: "#6B7280", margin: 0 }}>Fetching model information…</p>}
              {!previewLoading && previewError && (
                <p style={{ color: "#EF4444", margin: 0 }}>{previewError}</p>
              )}
              {!previewLoading && preview && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{preview.id}</div>
                      {preview.pipeline_tag && (
                        <div style={{ color: "#6B7280", fontSize: 14 }}>{preview.pipeline_tag}</div>
                      )}
                    </div>
                    {typeof preview.likes === "number" && (
                      <div title="Likes" style={{ color: "#6B7280", fontSize: 14 }}>❤ {preview.likes}</div>
                    )}
                  </div>
                  {preview.description && (
                    <p style={{ marginTop: 8, color: "#374151", whiteSpace: "pre-line" }}>
                      {preview.description.length > 300 ? preview.description.slice(0, 300) + "…" : preview.description}
                    </p>
                  )}
                  {preview?.tags && preview.tags.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                      {preview.tags.slice(0, 8).map((t) => (
                        <span key={t} style={{ fontSize: 12, padding: "4px 8px", background: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: 9999 }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {preview.private && (
                    <p style={{ color: "#EF4444", marginTop: 8 }}>This model is private. You may need authorization.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick picks for popular models */}
          <div style={{ marginTop: 20 }}>
            <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 8 }}>Try one of these popular models:</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
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
                  style={{
                    padding: "8px 12px",
                    borderRadius: 9999,
                    border: "1px solid #E5E7EB",
                    background: "white",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  title={`Use ${m}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 20 }}>
            Examples: huggingface.co/microsoft/DialoGPT-medium, meta-llama/Llama-2-7b-chat-hf
          </p>
        </SignedIn>
      </section>
    </div>
  );
}
