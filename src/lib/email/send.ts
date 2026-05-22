interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{ filename: string; content: string }>;
  replyTo?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1000, 3000, 8000];

export class EmailSendError extends Error {
  constructor(
    message: string,
    public readonly attempts: number,
    public readonly lastStatus?: number,
    public readonly lastBody?: string
  ) {
    super(message);
    this.name = "EmailSendError";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Resend-Versand mit Retry + exponential backoff.
// 4xx → kein Retry (Bad Request/Auth). 5xx/Netzwerk → Retry.
export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  let lastStatus: number | undefined;
  let lastBody: string | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Auswander-Kompass <bericht@auswanderkompass.de>",
          reply_to: opts.replyTo ?? "kontakt@auswanderkompass.de",
          to: opts.to,
          subject: opts.subject,
          html: opts.html,
          text: opts.text,
          attachments: opts.attachments,
        }),
      });

      if (res.ok) return;

      lastStatus = res.status;
      lastBody = await res.text().catch(() => "");

      if (res.status >= 400 && res.status < 500) {
        throw new EmailSendError(
          `Resend non-retryable error ${res.status}`,
          attempt + 1,
          lastStatus,
          lastBody
        );
      }
      // 5xx → retry
    } catch (err) {
      if (err instanceof EmailSendError) throw err;
      lastBody = err instanceof Error ? err.message : String(err);
    }

    if (attempt < MAX_RETRIES - 1) {
      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw new EmailSendError(
    `Resend failed after ${MAX_RETRIES} attempts`,
    MAX_RETRIES,
    lastStatus,
    lastBody
  );
}
