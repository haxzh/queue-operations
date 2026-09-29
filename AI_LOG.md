# AI Log

## Tools used

- ChatGPT

## How AI was used

AI was used for:
- initial project scaffolding
- TypeScript model suggestions
- mock API scaffolding
- reviewing state-management patterns
- generating implementation alternatives
- reviewing accessibility and error-state requirements
- reviewing the supplied AI-generated code in Part B

## Key prompts

Examples of prompts used during development:

1. "Break this Frontend Lead assessment into implementation steps while preserving only the stated requirements."
2. "Create a React TypeScript mock API with MSW, latency and approximately 10% random failures."
3. "Review an optimistic update implementation for rollback and error feedback."
4. "Review the supplied QueueList component as a senior frontend engineer."

## Raw AI output vs final version

### Example: polling cleanup

Raw AI-style implementation:

```ts
useEffect(() => {
  setInterval(() => {
    fetch("/api/queue");
  }, 3000);
}, []);
```

### Final version

```ts
useEffect(() => {
  const intervalId = window.setInterval(() => {
    void loadQueue(true);
  }, 5000);

  return () => window.clearInterval(intervalId);
}, [loadQueue]);
```

### Why it changed

The raw version creates an interval without cleanup and can create multiple intervals after remounts. The final version stores the interval ID, cleans it up on unmount, and uses the hook's stable queue-loading function.

The final implementation was reviewed against the assessment requirements rather than copied blindly.
