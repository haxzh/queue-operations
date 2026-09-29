import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { QueueEntry, QueueInfo } from "../../types/queue";
import { Button } from "../Button/Button";

interface CustomerDrawerProps {
  entry: QueueEntry | null;
  queues: QueueInfo[];
  onClose: () => void;
  onMove: (entryId: string, targetQueueId: string) => Promise<void>;
}

export function CustomerDrawer({
  entry,
  queues,
  onClose,
  onMove,
}: CustomerDrawerProps) {
  const [targetQueue, setTargetQueue] = useState("");
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    setTargetQueue("");
  }, [entry]);

  if (!entry) return null;

  const fields = [
    ["Customer ID", entry.customer.id],
    ["Name", entry.customer.name],
    ["Phone", entry.customer.phone],
    ["Email", entry.customer.email],
    ["Visit reason", entry.customer.visitReason],
    ["Notes", entry.customer.notes],
    ["Created by", entry.customer.createdBy],
    ["Insurance ID", entry.customer.insuranceId],
    ["Date of birth", entry.customer.dateOfBirth],
    ["Preferred language", entry.customer.preferredLanguage],
    ["Appointment time", entry.customer.appointmentTime],
    ["Department", entry.customer.department],
    ["Priority", entry.customer.priority],
    ["Created at", new Date(entry.customer.createdAt).toLocaleString()],
  ];

  const handleMove = async () => {
    if (!targetQueue) return;

    setMoving(true);
    await onMove(entry.id, targetQueue);
    setMoving(false);
  };

  return (
    <div className="drawer-overlay" onMouseDown={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="drawer-header">
          <div>
            <span className="eyebrow">Customer details</span>
            <h2 id="customer-drawer-title">{entry.customer.name}</h2>
          </div>

          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close customer details"
          >
            <X size={20} />
          </button>
        </header>

        <div className="drawer-content">
          <section className="drawer-section">
            <h3>Queue information</h3>

            <div className="detail-grid">
              <div>
                <span>Current queue</span>
                <strong>{entry.queueName}</strong>
              </div>
              <div>
                <span>Position</span>
                <strong>{entry.position}</strong>
              </div>
              <div>
                <span>Wait time</span>
                <strong>{entry.waitMins} mins</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{entry.status}</strong>
              </div>
            </div>
          </section>

          <section className="drawer-section">
            <h3>Customer information</h3>

            <dl className="field-list">
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="drawer-section">
            <h3>Move to another queue</h3>

            <label className="form-label" htmlFor="target-queue">
              Destination queue
            </label>

            <select
              id="target-queue"
              className="select"
              value={targetQueue}
              onChange={(event) => setTargetQueue(event.target.value)}
            >
              <option value="">Select a queue</option>
              {queues
                .filter((queue) => queue.id !== entry.queueId)
                .map((queue) => (
                  <option key={queue.id} value={queue.id}>
                    {queue.name}
                  </option>
                ))}
            </select>

            <Button
              variant="primary"
              disabled={!targetQueue || moving}
              onClick={handleMove}
            >
              {moving ? "Moving..." : "Move customer"}
            </Button>
          </section>
        </div>
      </aside>
    </div>
  );
}