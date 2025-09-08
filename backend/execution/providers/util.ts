export async function pipeSSE(resp: Response, onData: (data: any) => void) {
  const reader = resp.body!.getReader();
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
      const prefix = "data:";
      if (line.startsWith(prefix)) {
        const d = line.slice(prefix.length).trim();
        if (d === "[DONE]") return;
        try { onData(JSON.parse(d)); } catch {}
      }
    }
  }
}

