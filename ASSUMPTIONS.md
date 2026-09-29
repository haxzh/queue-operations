# Assumptions

1. The console is focused on one location at a time.
2. The default queue shown by the assessment is represented by the General Consultation queue.
3. "Near real time" can be simulated with polling because the brief allows polling or a simulated WebSocket.
4. A 5-second polling interval is sufficient for the prototype.
5. Approximately 10% random API failures are intentionally simulated by MSW.
6. A 30-minute wait is used as the long-wait threshold because the brief requires long waits to stand out but does not define an exact threshold.
7. The 14 customer fields can be shown in a detail panel instead of all being columns in the queue table.
8. A customer moved to another queue should disappear from the current queue view.
9. Only waiting customers can be called.
10. The first waiting customer is the target of "Call Next".
11. Native buttons and form controls are sufficient for the primary keyboard interaction model.
12. The mock API represents server state only for the current browser session.
13. Deployment is optional because the brief describes a deployed link as a plus.
