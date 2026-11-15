import { afterEach, describe, expect, it, vi } from "vitest";
import { Effect } from "effect";
import { createResendEmailCodeDelivery } from "../src/server/atlas-resend-email-delivery";

afterEach(() => vi.unstubAllGlobals());

describe("Atlas Resend OTP", () => {
  it("remains disabled without a secret and refuses an unexpected sender", () => {
    expect(createResendEmailCodeDelivery({ from: "no-reply@atlas-si.com" })).toBeNull();
    expect(() =>
      createResendEmailCodeDelivery({ apiKey: "re_test", from: "hello@openbot.run" }),
    ).toThrow(/atlas-si\.com/);
  });

  it("sends a scoped, Atlas-branded OTP without contacting the original mail service", async () => {
    const fetchMock = vi.fn(async () => new Response('{"id":"test-message"}', { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const delivery = createResendEmailCodeDelivery({
      apiKey: "re_test",
      from: "no-reply@atlas-si.com",
    });
    expect(delivery).not.toBeNull();

    await Effect.runPromise(delivery!.send({
      email: "test@example.com",
      code: "ABCD-EFGH",
      expiresAt: Date.now() + 5 * 60_000,
    }));

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Authorization: "Bearer re_test" });
    const payload = JSON.parse(String(init.body));
    expect(payload.from).toBe("no-reply@atlas-si.com");
    expect(payload.to).toEqual(["test@example.com"]);
    expect(payload.subject).toContain("AtlasBot");
    expect(payload.html).toContain("ABCD-EFGH");
    expect(payload.html).not.toContain("OpenBot");
  });

  it("converts provider rate limits to the account-service contract", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 429 })));
    const delivery = createResendEmailCodeDelivery({ apiKey: "re_test", from: "no-reply@atlas-si.com" })!;
    await expect(Effect.runPromise(delivery.send({
      email: "test@example.com", code: "ABCD-EFGH", expiresAt: Date.now() + 60_000,
    }))).rejects.toThrow();
  });
});
