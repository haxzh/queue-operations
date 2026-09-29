import { Eye, PhoneCall, UserCheck, UserX } from "lucide-react";
import type { QueueEntry } from "../../types/queue";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";

interface QueueListProps {
  entries: QueueEntry[];
  onSelect: (entry: QueueEntry) => void;
  onCall: (id: string) => void;
  onServed: (id: string) => void;
  onNoShow: (id: string) => void;
}

export function QueueList({
  entries,
  onSelect,
  onCall,
  onServed,
  onNoShow,
}: QueueListProps) {
  return (
    <div className="table-wrap">
      <table className="queue-table">
        <caption className="sr-only">Current clinic waiting queue</caption>
        <thead>
          <tr>
            <th scope="col">Position</th>
            <th scope="col">Customer</th>
            <th scope="col">Visit reason</th>
            <th scope="col">Wait</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => {
            const isLongWait =
              entry.status === "waiting" && entry.waitMins > 30;

            return (
              <tr
                key={entry.id}
                className={isLongWait ? "long-wait-row" : ""}
              >
                <td data-label="Position">
                  <strong>{entry.position}</strong>
                </td>

                <td data-label="Customer">
                  <button
                    className="customer-button"
                    onClick={() => onSelect(entry)}
                    aria-label={`View details for ${entry.customer.name}`}
                  >
                    <span className="customer-avatar" aria-hidden="true">
                      {entry.customer.name.charAt(0)}
                    </span>
                    <span>
                      <strong>{entry.customer.name}</strong>
                      <small>{entry.customer.phone}</small>
                    </span>
                  </button>
                </td>

                <td data-label="Visit reason">
                  {entry.customer.visitReason}
                </td>

                <td data-label="Wait">
                  <span
                    className={isLongWait ? "wait-long" : ""}
                    aria-label={
                      isLongWait
                        ? `${entry.waitMins} minutes, long wait`
                        : `${entry.waitMins} minutes`
                    }
                  >
                    {entry.waitMins} min
                  </span>
                  {isLongWait && (
                    <span className="sr-only"> Long wait</span>
                  )}
                </td>

                <td data-label="Status">
                  <Badge status={entry.status} />
                </td>

                <td data-label="Actions">
                  <div className="row-actions">
                    {entry.status === "waiting" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onCall(entry.id)}
                        aria-label={`Call ${entry.customer.name}`}
                      >
                        <PhoneCall size={15} aria-hidden="true" />
                        Call
                      </Button>
                    )}

                    {entry.status === "called" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onServed(entry.id)}
                        aria-label={`Mark ${entry.customer.name} as served`}
                      >
                        <UserCheck size={15} aria-hidden="true" />
                        Served
                      </Button>
                    )}

                    {entry.status === "waiting" && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onNoShow(entry.id)}
                        aria-label={`Mark ${entry.customer.name} as no-show`}
                      >
                        <UserX size={15} aria-hidden="true" />
                        No-show
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSelect(entry)}
                      aria-label={`Open ${entry.customer.name} details`}
                    >
                      <Eye size={15} aria-hidden="true" />
                      Details
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}