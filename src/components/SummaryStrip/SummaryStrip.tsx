import type { QueueSummary } from "../../types/queue";

interface SummaryStripProps {
  summary: QueueSummary;
}

export function SummaryStrip({ summary }: SummaryStripProps) {
  return (
    <section className="summary-grid" aria-label="Queue summary">
      <article className="summary-card">
        <span className="summary-label">Customers waiting</span>
        <strong>{summary.waiting}</strong>
      </article>

      <article className="summary-card">
        <span className="summary-label">Average wait</span>
        <strong>{summary.averageWait} min</strong>
      </article>

      <article
        className={`summary-card ${
          summary.longestWait > 30 ? "summary-alert" : ""
        }`}
      >
        <span className="summary-label">Longest wait</span>
        <strong>{summary.longestWait} min</strong>
        {summary.longestWait > 30 && (
          <span className="summary-hint">Needs attention</span>
        )}
      </article>
    </section>
  );
}