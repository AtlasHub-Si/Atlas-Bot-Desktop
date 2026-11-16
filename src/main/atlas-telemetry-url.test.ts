import { describe, expect, it } from "vitest";
import { atlasTelemetryEndpoint } from "./atlas-telemetry-url";

describe("AtlasBot telemetry ownership gate", () => {
  it("disables telemetry by default", () => {
    expect(atlasTelemetryEndpoint(undefined)).toBeNull();
    expect(atlasTelemetryEndpoint("")).toBeNull();
  });
  it("allows only HTTPS Atlas-controlled hosts", () => {
    expect(atlasTelemetryEndpoint("https://api-test.atlas-si.com/api")).toBe("https://api-test.atlas-si.com/api");
    expect(atlasTelemetryEndpoint("https://telemetry.atlashub.si/events")).toBe("https://telemetry.atlashub.si/events");
  });
  it("allows explicit loopback development capture", () => {
    expect(atlasTelemetryEndpoint("http://127.0.0.1:3200/api")).toBe("http://127.0.0.1:3200/api");
  });
  it.each([
    "https://analytics.openbot.run/api",
    "https://atlas-si.com.evil.example/api",
    "https://other.example/api",
    "http://api-test.atlas-si.com/api",
    "https://user:pass@atlas-si.com/api",
    "https://atlas-si.com/api#fragment",
    "file:///etc/passwd",
    "not a URL",
  ])("rejects external, insecure or malformed destination %s", (url) => {
    expect(atlasTelemetryEndpoint(url)).toBeNull();
  });
});
