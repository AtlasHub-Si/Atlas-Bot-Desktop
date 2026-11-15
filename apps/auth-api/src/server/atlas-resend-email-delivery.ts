import { Effect } from "effect";
import { prepareEmailCode, RATE_LIMITED_DELIVERY_ERROR } from "./smtp-email-delivery";
import type { EmailCodeDelivery } from "./types";

/** Atlas-only OTP through Resend HTTP API. No upstream SMTP relay or mailbox. */
export function createResendEmailCodeDelivery(input: {
  apiKey?: string;
  from?: string;
}): EmailCodeDelivery | null {
  const apiKey = input.apiKey?.trim();
  if (!apiKey) return null;

  const from = input.from?.trim();
  if (!from || !/^[a-z0-9._%+-]+@atlas-si\.com$/iu.test(from)) {
    throw new Error("Atlas Resend OTP requires EMAIL_FROM on the verified atlas-si.com domain.");
  }

  const send = Effect.fn("AtlasResend.sendCode")(function* (
    message: Parameters<EmailCodeDelivery["send"]>[0],
  ) {
    // Preserve the existing code + recipient validation before calling the provider.
    yield* prepareEmailCode(message);

    const minutes = Math.max(1, Math.ceil((message.expiresAt - Date.now()) / 60_000));
    const subject = "Código de acesso AtlasBot";
    const text = `O teu código de acesso AtlasBot é: ${message.code}. Válido durante aproximadamente ${minutes} minuto(s). Se não pediste este código, ignora esta mensagem.`;
    const html = `<html><body style="font-family:Arial,sans-serif;background:#f6f8fb;padding:30px"><div style="max-width:480px;margin:auto;padding:24px;background:#fff;border-radius:14px"><h2>AtlasBot</h2><p>O teu código de acesso é:</p><p style="font-size:30px;font-weight:700;letter-spacing:3px">${message.code}</p><p>Válido durante aproximadamente ${minutes} minuto(s).</p><p style="color:#64748b;font-size:12px">Se não pediste este código, ignora esta mensagem.</p></div></body></html>`;

    const response = yield* Effect.tryPromise({
      try: (signal) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ from, to: [message.email], subject, text, html }),
          signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
        }),
      // After a timeout it is not safe to assume Resend did not accept the message.
      catch: () => new AtlasResendDeliveryError("email_delivery_unknown"),
    });
    if (response.status === 429) return yield* new AtlasResendDeliveryError(RATE_LIMITED_DELIVERY_ERROR);
    if (!response.ok) {
      return yield* new AtlasResendDeliveryError(
        response.status >= 500 ? "email_delivery_unknown" : "email_delivery_resend_failed",
      );
    }
  });
  return { send };
}

/** Class name is internal; the account service branches on the stable error message. */
class AtlasResendDeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AtlasResendDeliveryError";
  }
}
