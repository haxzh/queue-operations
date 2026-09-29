import type {
  MoveQueuePayload,
  QueueEntry,
  QueueInfo,
} from "../types/queue";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Something went wrong.");
  }

  return response.json() as Promise<T>;
}

export async function getQueue(
  locationId: string
): Promise<QueueEntry[]> {
  const response = await fetch(`/api/locations/${locationId}/queue`);
  return handleResponse<QueueEntry[]>(response);
}

export async function getQueues(): Promise<QueueInfo[]> {
  const response = await fetch("/api/queues");
  return handleResponse<QueueInfo[]>(response);
}

export async function callCustomer(
  queueId: string
): Promise<QueueEntry> {
  const response = await fetch(`/api/queue/${queueId}/call`, {
    method: "POST",
  });

  return handleResponse<QueueEntry>(response);
}

export async function markServed(
  queueId: string
): Promise<QueueEntry> {
  const response = await fetch(`/api/queue/${queueId}/served`, {
    method: "POST",
  });

  return handleResponse<QueueEntry>(response);
}

export async function markNoShow(
  queueId: string
): Promise<QueueEntry> {
  const response = await fetch(`/api/queue/${queueId}/no-show`, {
    method: "POST",
  });

  return handleResponse<QueueEntry>(response);
}

export async function moveCustomer(
  queueId: string,
  payload: MoveQueuePayload
): Promise<QueueEntry> {
  const response = await fetch(`/api/queue/${queueId}/move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<QueueEntry>(response);
}