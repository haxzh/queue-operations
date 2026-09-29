# UX Notes

## User and context

The primary user is busy front-desk clinic staff. They may be standing, interrupted, speaking with customers, and working on a desktop or tablet.

This means the interface should prioritize:
- fast scanning
- obvious primary actions
- large enough click targets
- visible status
- minimal navigation away from the queue
- clear feedback when an action succeeds or fails

## Three important design decisions

### 1. Keep the queue as the primary surface

The queue remains visible while customer details open in a drawer.

Trade-off: the drawer uses screen space, but staff do not lose their place in the queue.

### 2. Use optimistic updates for queue actions

Actions immediately update the visible UI while the request is sent to the API.

Trade-off: the UI can temporarily show a state that the server rejects. The implementation therefore rolls back the change and shows explicit feedback.

### 3. Highlight long waits without relying on color alone

Waits over 30 minutes are visually emphasized and also receive textual/semantic indication.

Trade-off: additional emphasis creates visual hierarchy, but avoids hiding urgent cases in a dense table.

## Response to the 14-field request

I would not place all 14 customer fields into the main queue table.

The queue is an operational scanning surface. Showing every field would increase density, horizontal scrolling, and cognitive load. Staff need a small set of fields to make queue decisions quickly.

Instead:
- keep decision-critical fields in the queue
- open the customer drawer without losing the queue
- expose all 14 fields in the drawer

This preserves access to every field without making the main queue harder to scan.

## First user test

I would test whether front-desk staff can complete three tasks quickly:
1. call the next customer
2. identify the longest-waiting customer
3. open a customer and move them to another queue

I would observe errors, hesitation, accidental actions, and whether the drawer causes them to lose their place.
