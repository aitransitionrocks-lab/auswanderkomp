export class MetadataParseError extends Error {
  constructor(message: string, public readonly raw: unknown) {
    super(message);
    this.name = "MetadataParseError";
  }
}

// Hart fehlschlagen statt silent skip. Liefert validierte 10er-Score-Liste.
export function parseMetadataAnswers(raw: string | undefined): number[] {
  if (!raw) {
    throw new MetadataParseError("metadata.answers fehlt", raw);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new MetadataParseError(
      "metadata.answers ist kein valides JSON",
      raw
    );
  }

  if (!Array.isArray(parsed)) {
    throw new MetadataParseError("metadata.answers ist kein Array", raw);
  }

  if (parsed.length !== 10) {
    throw new MetadataParseError(
      `metadata.answers hat Länge ${parsed.length}, erwartet 10`,
      raw
    );
  }

  return parsed.map((v, i) => {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 4) {
      throw new MetadataParseError(
        `metadata.answers[${i}] ist ${v}, erwartet Integer 1-4`,
        raw
      );
    }
    return n;
  });
}
