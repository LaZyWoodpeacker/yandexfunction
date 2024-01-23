export const isTrigger = (event) =>
  event?.event_metadata &&
  event.event_metadata.event_type ===
    "yandex.cloud.events.serverless.triggers.TimerMessage";
