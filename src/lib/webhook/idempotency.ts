// Idempotenz via Upstash Redis REST-API — keine SDK-Dependency.
// Graceful: ohne KV-ENV no-op (returns false / skip), App bleibt funktionsfähig.

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const EVENT_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 Tage

interface ProcessedData {
  status: "success" | "failed";
  error?: string;
}

function kvReady(): boolean {
  return (
    !!KV_URL &&
    !!KV_TOKEN &&
    !KV_URL.startsWith("your_") &&
    !KV_TOKEN.startsWith("your_")
  );
}

function key(eventId: string): string {
  return encodeURIComponent(`webhook:processed:${eventId}`);
}

export async function wasEventProcessed(eventId: string): Promise<boolean> {
  if (!kvReady()) return false;
  try {
    const res = await fetch(`${KV_URL}/get/${key(eventId)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { result: string | null };
    return json.result != null;
  } catch (err) {
    console.error("[idempotency] read failed (treat as unprocessed):", err);
    return false;
  }
}

export async function markEventProcessed(
  eventId: string,
  data: ProcessedData
): Promise<void> {
  if (!kvReady()) {
    console.log(
      `[idempotency] KV not configured — skip mark for ${eventId} (${data.status})`
    );
    return;
  }
  try {
    const value = encodeURIComponent(JSON.stringify(data));
    await fetch(
      `${KV_URL}/set/${key(eventId)}/${value}?EX=${EVENT_TTL_SECONDS}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${KV_TOKEN}` },
        cache: "no-store",
      }
    );
  } catch (err) {
    console.error("[idempotency] mark failed:", err);
  }
}
