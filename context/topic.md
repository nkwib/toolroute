# Topic

Type-safe agent state-machine library with type-level transition guarantees. XState-shaped, but for LLM tool-use loops: states represent agent reasoning phases (planning, tool-call, reflection, final-answer), transitions are checked at compile time, and tool-call schemas are derived from the SDK definitions. Goal: agent dev DX where invalid trajectories are TypeScript errors, not runtime crashes.

## Args

- seeds: 3 (default)
- rounds: 2 (default)
- tribe: devtools (matt-pocock, addy-osmani, theo-browne, guillermo-rauch)
- web grounding: round-1 only (default)

## Constraints

- **Timebox:** 2-4 weeks
- **OSS or paid lean:** Hybrid (OSS core + paid hosting/visualizer)
- **Hard-no domains:** Healthcare/HIPAA, Education K-12 (in addition to skill defaults)
