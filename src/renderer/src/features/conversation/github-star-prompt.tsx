/** Internal AtlasBot evaluation does not show unsolicited promotion prompts. */
export function githubStarPromptShownThisSession(): boolean {
  return false;
}

/** Keep the message hook compatible without changing saved prompt state. */
export function noteAgentMessageSent(): void {
  return;
}
