# Part B — AI-Generated Code Review

## Review comments ordered by severity

### Blocker — State is mutated directly

```ts
entries[0].status = "called";
setEntries(entries);
```

React state should be treated as immutable. Mutating the existing array/object and passing the same array reference to state can prevent reliable rerendering and makes state transitions difficult to reason about.

Use a new array and new object for the changed entry.

### Blocker — Interval is never cleaned up

```ts
setInterval(() => {
  ...
}, 3000);
```

The interval ID is not stored and `clearInterval` is never called. This can leave timers running after the component unmounts and can create duplicate polling when the effect runs again.

### High — Effect has an incomplete dependency model

```ts
useEffect(() => {
  ...
}, []);
```

`locationId` is used by the effect but is not represented in its dependency model. The component can therefore fetch the wrong location if `locationId` changes.

### High — No loading, error or retry handling

The request assumes success:

```ts
fetch(...)
  .then(r => r.json())
  .then(setEntries);
```

There is no handling for network errors or non-2xx responses, and the UI cannot communicate loading or recovery.

### High — Optimistic update is not implemented

The assessment requires optimistic updates with rollback and clear feedback when the server rejects an action. The submitted action updates local state immediately but never restores the previous state when the request fails.

### Medium — Array index is used as the React key

```tsx
key={i}
```

Queue entries have stable IDs. The ID should be used as the key so React can preserve item identity when queue order changes.

### Medium — Button is implemented as a clickable div

```tsx
<div className="btn" onClick={callNext}>
```

A native `<button>` provides keyboard interaction, semantics and accessibility behavior without custom event handling.

### Medium — No request guard for an empty queue

```ts
entries[0]
```

This assumes an entry exists. An empty queue would cause a runtime error.

### Medium — Color is the only long-wait signal

```tsx
style={{ color: e.waitMins > 30 ? "red" : "black" }}
```

The assessment explicitly says information should not be conveyed by color alone. Long waits need another semantic/textual indicator.

## Corrected version

```tsx
import { useCallback, useEffect, useState } from "react";

type QueueEntry = {
  id: string;
  name: string;
  waitMins: number;
  status: "waiting" | "called";
};

export default function QueueList({
  locationId,
}: {
  locationId: string;
}) {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/locations/${locationId}/queue`
      );

      if (!response.ok) {
        throw new Error("Failed to load queue.");
      }

      const data = (await response.json()) as QueueEntry[];
      setEntries(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load queue."
      );
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    void loadQueue();

    const intervalId = window.setInterval(() => {
      void loadQueue();
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [loadQueue]);

  const callNext = async () => {
    const next = entries.find(
      (entry) => entry.status === "waiting"
    );

    if (!next) {
      return;
    }

    const previous = entries;

    setEntries((current) =>
      current.map((entry) =>
        entry.id === next.id
          ? { ...entry, status: "called" }
          : entry
      )
    );

    try {
      const response = await fetch(
        `/api/queue/${next.id}/call`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Call action was rejected.");
      }
    } catch {
      setEntries(previous);
      setError("Call action failed. The change was rolled back.");
    }
  };

  if (loading) {
    return <p>Loading queue...</p>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={() => void loadQueue()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <section aria-label="Queue">
      <button onClick={() => void callNext()}>
        Call Next
      </button>

      {entries.map((entry) => {
        const longWait = entry.waitMins > 30;

        return (
          <div key={entry.id}>
            <span>{entry.name}</span>
            <span>
              {entry.waitMins} min
              {longWait && " — Long wait"}
            </span>
          </div>
        );
      })}
    </section>
  );
}
```
