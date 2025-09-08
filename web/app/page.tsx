"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [hfUrl, setHfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hfUrl.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hfUrl: hfUrl.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to generate lesson" }));
        throw new Error(errorData.error?.message || "Failed to generate lesson");
      }

      const data = await response.json();
      if (data.success && data.tutorialId) {
        router.push(`/tutorial/${data.tutorialId}`);
      } else {
        throw new Error("Failed to create tutorial");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
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
            <button
              type="submit"
              disabled={loading || !hfUrl.trim()}
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
              {loading ? "Generating Lesson..." : "Generate ALAIN Notebook"}
            </button>
          </form>

          {error && (
            <p style={{ color: "#EF4444", marginTop: 16 }}>
              {error}
            </p>
          )}

          <p style={{ color: "#6B7280", fontSize: 14, marginTop: 20 }}>
            Examples: huggingface.co/microsoft/DialoGPT-medium, meta-llama/Llama-2-7b-chat-hf
          </p>
        </SignedIn>
      </section>
    </div>
  );
}
