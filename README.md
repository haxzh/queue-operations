# Queue Operations Console

A React + TypeScript queue management console for a busy clinic front desk.

## Requirements covered

- Live queue board
- Call next
- Mark served
- Mark no-show
- Move customer to another queue
- Customer detail drawer
- Queue summary: waiting, average wait, longest wait
- Mock API with MSW
- Artificial latency and approximately 10% random failure
- Loading, empty, error and retry states
- Optimistic updates with rollback and feedback
- Polling-based real-time simulation
- Stable ordering for new arrivals
- Reusable UI components
- Keyboard-operable native controls and visible focus
- Responsive desktop and tablet layouts

## Run locally

```bash
npm install
npx msw init public/ --save
npm run dev
```

## Build

```bash
npm run build
```

## Architecture

```text
App
 ├── SummaryStrip
 ├── QueueList
 │    ├── Badge
 │    └── Button
 ├── CustomerDrawer
 ├── Toast
 └── EmptyState

useQueue
 └── queueApi
      └── MSW handlers
           └── mock data
```

## Styling decision

The assessment does not require a specific styling library. This implementation uses a small CSS token layer and reusable classes instead of adding a utility framework. This keeps the assessment dependency-light and makes the design tokens explicit.

## AI use

AI was used as a development assistant for scaffolding, reviewing implementation choices, and explaining trade-offs. All generated code was reviewed and adapted to the requirements before inclusion. See `AI_LOG.md`.
