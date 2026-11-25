import crypto from "crypto";

export type WebhookProvider = "stripe" | "intasend" | "mpesa";

export interface SignatureVerificationResult {
  verified: boolean;
  reason?: string;
}

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies inbound payment provider webhook signatures using server-side secrets.
 * Rejects unsigned or tampered payloads before any database state is touched.
 */
export function verifyPaymentWebhookSignature(
  provider: WebhookProvider,
  rawBody: string,
  signatureHeader: string | null
): SignatureVerificationResult {
  if (!signatureHeader) {
    return { verified: false, reason: "Missing webhook signature header." };
  }

  const secretEnvMap: Record<WebhookProvider, string | undefined> = {
    stripe: process.env.STRIPE_WEBHOOK_SECRET,
    intasend: process.env.INTASEND_WEBHOOK_SECRET,
    mpesa: process.env.MPESA_WEBHOOK_SECRET,
  };

  const secret = secretEnvMap[provider];
  if (!secret) {
    return {
      verified: false,
      reason: `Server webhook secret for ${provider} is not configured.`,
    };
  }

  // Stripe uses "t=...,v1=..." format; IntaSend & M-Pesa use hex HMAC-SHA256
  if (provider === "stripe") {
    const parts = Object.fromEntries(
      signatureHeader.split(",").map((kv) => {
        const [k, v] = kv.split("=");
        return [k?.trim(), v?.trim()];
      })
    );
    const timestamp = parts["t"];
    const sigV1 = parts["v1"];
    if (!timestamp || !sigV1) {
      return { verified: false, reason: "Malformed Stripe-Signature header." };
    }
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${rawBody}`)
      .digest("hex");

    return timingSafeCompare(expected, sigV1)
      ? { verified: true }
      : { verified: false, reason: "Stripe signature mismatch." };
  }

  const expectedHex = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  return timingSafeCompare(expectedHex, signatureHeader.trim())
    ? { verified: true }
    : { verified: false, reason: `${provider} signature mismatch.` };
}
