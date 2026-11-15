import { Schema } from "effect";

/** Shared account email transport error, independent of provider. */
export class EmailDeliveryError extends Schema.TaggedError<EmailDeliveryError>()("EmailDeliveryError", {
  message: Schema.String,
}) {}
