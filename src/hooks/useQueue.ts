import { useCallback, useEffect, useRef, useState } from "react";
import {
  callCustomer,
  getQueue,
  getQueues,
  markNoShow,
  markServed,
  moveCustomer,
} from "../api/queueApi";
import type { QueueEntry, QueueInfo } from "../types/queue";

type ActionResult = {
  success: boolean;
  message: string;
};

export function useQueue(locationId: string) {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousEntriesRef = useRef<QueueEntry[]>([]);

  const loadQueue = useCallback(
    async (silent = false) => {
      try {
        if (silent) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const data = await getQueue(locationId);

        setEntries((current) => {
          previousEntriesRef.current = current;
          return mergeWithoutJump(current, data);
        });

        setError(null);
      } catch (err) {
        if (!silent) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load the queue."
          );
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [locationId]
  );

  const loadQueues = useCallback(async () => {
    try {
      const data = await getQueues();
      setQueues(data);
    } catch {
      // The main queue can still function if the queue-list request fails.
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadQueue(), loadQueues()]);
  }, [loadQueue, loadQueues]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void loadQueue(true);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [loadQueue]);

  const optimisticAction = useCallback(
    async (
      queueId: string,
      updater: (items: QueueEntry[]) => QueueEntry[],
      request: () => Promise<QueueEntry>,
      successMessage: string
    ): Promise<ActionResult> => {
      const previous = entries;

      setEntries(updater);

      try {
        await request();
        await loadQueue(true);

        return {
          success: true,
          message: successMessage,
        };
      } catch (err) {
        setEntries(previous);

        return {
          success: false,
          message:
            err instanceof Error
              ? `${err.message} Changes were rolled back.`
              : "Action failed. Changes were rolled back.",
        };
      }
    },
    [entries, loadQueue]
  );

  const callCustomerOptimistic = async (
    queueId: string
  ): Promise<ActionResult> => {
    const entry = entries.find((item) => item.id === queueId);

    if (!entry) {
      return {
        success: false,
        message: "Customer is no longer in the queue.",
      };
    }

    if (entry.status !== "waiting") {
      return {
        success: false,
        message: "Only waiting customers can be called.",
      };
    }

    return optimisticAction(
      queueId,
      (items) =>
        items.map((item) =>
          item.id === queueId
            ? { ...item, status: "called" }
            : item
        ),
      () => callCustomer(queueId),
      `${entry.customer.name} was called.`
    );
  };

  const callNext = async (): Promise<ActionResult> => {
    const next = entries.find((entry) => entry.status === "waiting");

    if (!next) {
      return {
        success: false,
        message: "There are no waiting customers.",
      };
    }

    return callCustomerOptimistic(next.id);
  };

  const serveCustomer = async (
    queueId: string
  ): Promise<ActionResult> => {
    return optimisticAction(
      queueId,
      (items) =>
        items.map((item) =>
          item.id === queueId
            ? { ...item, status: "served" }
            : item
        ),
      () => markServed(queueId),
      "Customer marked as served."
    );
  };

  const noShowCustomer = async (
    queueId: string
  ): Promise<ActionResult> => {
    return optimisticAction(
      queueId,
      (items) =>
        items.map((item) =>
          item.id === queueId
            ? { ...item, status: "no-show" }
            : item
        ),
      () => markNoShow(queueId),
      "Customer marked as no-show."
    );
  };

  const moveQueue = async (
    queueId: string,
    targetQueueId: string
  ): Promise<ActionResult> => {
    const previous = entries;

    setEntries((items) =>
      items.filter((item) => item.id !== queueId)
    );

    try {
      await moveCustomer(queueId, { targetQueueId });
      await loadQueue(true);

      return {
        success: true,
        message: "Customer moved to the selected queue.",
      };
    } catch (err) {
      setEntries(previous);

      return {
        success: false,
        message:
          err instanceof Error
            ? `${err.message} Changes were rolled back.`
            : "Move failed. Changes were rolled back.",
      };
    }
  };

  const summary = getSummary(entries);

  return {
    entries,
    queues,
    summary,
    isLoading,
    isRefreshing,
    error,
    retry: () => loadQueue(false),
    callNext,
    callCustomer: callCustomerOptimistic,
    serveCustomer,
    noShowCustomer,
    moveQueue,
  };
}

function mergeWithoutJump(
  current: QueueEntry[],
  incoming: QueueEntry[]
): QueueEntry[] {
  const incomingById = new Map(incoming.map((entry) => [entry.id, entry]));
  const incomingIds = new Set(incoming.map((entry) => entry.id));

  const existingInSameOrder = current
    .filter((entry) => incomingIds.has(entry.id))
    .map((entry) => incomingById.get(entry.id)!)
    .filter(Boolean);

  const newEntries = incoming.filter(
    (entry) => !current.some((currentEntry) => currentEntry.id === entry.id)
  );

  return [...existingInSameOrder, ...newEntries];
}

function getSummary(entries: QueueEntry[]) {
  const waiting = entries.filter((entry) => entry.status === "waiting");

  const averageWait =
    waiting.length === 0
      ? 0
      : Math.round(
          waiting.reduce((sum, entry) => sum + entry.waitMins, 0) /
            waiting.length
        );

  const longestWait =
    waiting.length === 0
      ? 0
      : Math.max(...waiting.map((entry) => entry.waitMins));

  return {
    waiting: waiting.length,
    averageWait,
    longestWait,
  };
}