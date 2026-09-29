import { http, HttpResponse, delay } from "msw";
import { maybeAddArrival, queueEntries, queues } from "./data";

const shouldFail = () => Math.random() < 0.1;

function recalculatePositions() {
  for (const queue of queues) {
    let position = 1;
    for (const entry of queueEntries) {
      if (entry.queueId === queue.id && entry.status === "waiting") {
        entry.position = position++;
      }
    }
  }
}

function updateWaitTimes() {
  const now = Date.now();

  for (const entry of queueEntries) {
    if (entry.status === "waiting") {
      entry.waitMins = Math.max(
        0,
        Math.floor((now - new Date(entry.customer.createdAt).getTime()) / 60_000)
      );
    }
  }
}

export const handlers = [
  http.get("/api/locations/:locationId/queue", async ({ params }) => {
    await delay(650);

    if (shouldFail()) {
      return HttpResponse.json(
        { message: "Unable to load the queue right now." },
        { status: 500 }
      );
    }

    updateWaitTimes();
    maybeAddArrival();
    recalculatePositions();

    const queueId = "general";
    const result = queueEntries.filter(
      (entry) => entry.queueId === queueId
    );

    return HttpResponse.json(result);
  }),

  http.get("/api/queues", async () => {
    await delay(350);
    return HttpResponse.json(queues);
  }),

  http.post("/api/queue/:queueId/call", async ({ params }) => {
    await delay(650);

    if (shouldFail()) {
      return HttpResponse.json(
        { message: "The server rejected the call action." },
        { status: 500 }
      );
    }

    const entry = queueEntries.find((item) => item.id === params.queueId);

    if (!entry) {
      return HttpResponse.json(
        { message: "Queue entry not found." },
        { status: 404 }
      );
    }

    if (entry.status !== "waiting") {
      return HttpResponse.json(
        { message: "Only waiting customers can be called." },
        { status: 409 }
      );
    }

    entry.status = "called";
    entry.updatedAt = new Date().toISOString();
    recalculatePositions();

    return HttpResponse.json(entry);
  }),

  http.post("/api/queue/:queueId/served", async ({ params }) => {
    await delay(650);

    if (shouldFail()) {
      return HttpResponse.json(
        { message: "The server rejected the served action." },
        { status: 500 }
      );
    }

    const entry = queueEntries.find((item) => item.id === params.queueId);

    if (!entry) {
      return HttpResponse.json(
        { message: "Queue entry not found." },
        { status: 404 }
      );
    }

    entry.status = "served";
    entry.updatedAt = new Date().toISOString();
    recalculatePositions();

    return HttpResponse.json(entry);
  }),

  http.post("/api/queue/:queueId/no-show", async ({ params }) => {
    await delay(650);

    if (shouldFail()) {
      return HttpResponse.json(
        { message: "The server rejected the no-show action." },
        { status: 500 }
      );
    }

    const entry = queueEntries.find((item) => item.id === params.queueId);

    if (!entry) {
      return HttpResponse.json(
        { message: "Queue entry not found." },
        { status: 404 }
      );
    }

    entry.status = "no-show";
    entry.updatedAt = new Date().toISOString();
    recalculatePositions();

    return HttpResponse.json(entry);
  }),

  http.post(
    "/api/queue/:queueId/move",
    async ({ params, request }) => {
      await delay(650);

      if (shouldFail()) {
        return HttpResponse.json(
          { message: "The server rejected the move action." },
          { status: 500 }
        );
      }

      const body = (await request.json()) as { targetQueueId?: string };
      const targetQueue = queues.find(
        (queue) => queue.id === body.targetQueueId
      );

      if (!targetQueue) {
        return HttpResponse.json(
          { message: "Target queue not found." },
          { status: 400 }
        );
      }

      const entry = queueEntries.find((item) => item.id === params.queueId);

      if (!entry) {
        return HttpResponse.json(
          { message: "Queue entry not found." },
          { status: 404 }
        );
      }

      entry.queueId = targetQueue.id;
      entry.queueName = targetQueue.name;
      entry.updatedAt = new Date().toISOString();
      recalculatePositions();

      return HttpResponse.json(entry);
    }
  ),
];