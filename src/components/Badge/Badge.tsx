import type { QueueStatus } from "../../types/queue";

export function Badge({ status }: { status: QueueStatus }) {
  const label = status === "no-show"
    ? "No-show"
    : status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`badge badge-${status}`}>
      <span className="status-dot" aria-hidden="true" />
      {label}
    </span>
  );
}