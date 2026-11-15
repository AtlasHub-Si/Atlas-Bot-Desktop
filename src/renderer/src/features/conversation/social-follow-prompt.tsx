/** Keep conversation hooks compatible. Internal AtlasBot builds do not request social posts. */
export function noteSocialFollowMessageSent(): void {
  return;
}

export function noteSocialFollowReplyCompleted(): void {
  return;
}
