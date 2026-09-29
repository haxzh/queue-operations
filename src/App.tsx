import { useEffect, useState } from "react";
import { Activity, Clock3, RefreshCw, Users } from "lucide-react";
import { useQueue } from "./hooks/useQueue";
import type { QueueEntry } from "./types/queue";
import { Button } from "./components/Button/Button";
import { SummaryStrip } from "./components/SummaryStrip/SummaryStrip";
import { QueueList } from "./components/QueueList/QueueList";
import { CustomerDrawer } from "./components/CustomerDrawer/CustomerDrawer";
import { EmptyState } from "./components/EmptyState/EmptyState";
import { Toast } from "./components/Toast/Toast";

function App() {
  const {
    entries,
    queues,
    summary,
    isLoading,
    isRefreshing,
    error,
    retry,
    callNext,
    callCustomer,
    serveCustomer,
    noShowCustomer,
    moveQueue,
  } = useQueue("location-1");

  const [selectedEntry, setSelectedEntry] = useState<QueueEntry | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showResult = (result: {
    success: boolean;
    message: string;
  }) => {
    setToast({
      message: result.message,
      type: result.success ? "success" : "error",
    });
  };

  const handleMove = async (
    entryId: string,
    targetQueueId: string
  ) => {
    const result = await moveQueue(entryId, targetQueueId);

    showResult(result);

    if (result.success) {
      setSelectedEntry(null);
    }
  };

  const handleCallNext = async () => {
    showResult(await callNext());
  };

  const handleCall = async (id: string) => {
    showResult(await callCustomer(id));
  };

  if (isLoading) {
    return (
      <div className="app-shell">
        <main className="loading-screen">
          <div className="spinner" aria-hidden="true" />
          <p>Loading queue...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <Activity size={21} />
          </div>
          <div>
            <span className="eyebrow">Clinic operations</span>
            <h1>Queue Console</h1>
          </div>
        </div>

        <div className="topbar-actions">
          <span className="live-indicator">
            <span className="live-dot" aria-hidden="true" />
            Live
          </span>

          <Button
            variant="primary"
            onClick={handleCallNext}
            disabled={!entries.some((entry) => entry.status === "waiting")}
          >
            <Users size={16} aria-hidden="true" />
            Call Next
          </Button>
        </div>
      </header>

      <main className="page-content">
        <section className="page-heading">
          <div>
            <span className="eyebrow">Location 01</span>
            <h2>General Consultation Queue</h2>
            <p>
              Manage arrivals while keeping the current queue visible.
            </p>
          </div>

          <div className="sync-status" aria-live="polite">
            <Clock3 size={16} aria-hidden="true" />
            {isRefreshing ? "Syncing..." : "Auto-refresh every 5 seconds"}
          </div>
        </section>

        <SummaryStrip summary={summary} />

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <Button variant="secondary" size="sm" onClick={retry}>
              <RefreshCw size={15} aria-hidden="true" />
              Retry
            </Button>
          </div>
        )}

        <section className="queue-card" aria-labelledby="queue-title">
          <div className="queue-card-header">
            <div>
              <h2 id="queue-title">Waiting queue</h2>
              <p>
                {summary.waiting} customers currently waiting
              </p>
            </div>
          </div>

          {entries.length === 0 ? (
            <EmptyState
              title="Queue is empty"
              description="There are no customers waiting right now."
            />
          ) : (
            <QueueList
              entries={entries}
              onSelect={setSelectedEntry}
              onCall={handleCall}
              onServed={async (id) => {
                showResult(await serveCustomer(id));
              }}
              onNoShow={async (id) => {
                showResult(await noShowCustomer(id));
              }}
            />
          )}
        </section>

        <p className="keyboard-hint">
          Tip: Use Tab to move through controls and Enter/Space to activate
          actions.
        </p>
      </main>

      <CustomerDrawer
        entry={selectedEntry}
        queues={queues}
        onClose={() => setSelectedEntry(null)}
        onMove={handleMove}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;