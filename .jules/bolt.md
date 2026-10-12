## 2026-08-04 - React Array Render Re-renders
**Learning:** Found an opportunity where complex list operations (sorting and filtering) were running on every re-render in `VnpAnalyticsCards.tsx`.
**Action:** Always wrap heavy list mapping, filtering, and sorting in React `useMemo` hooks with proper dependencies to avoid unnecessary main thread blocking in heavily reactive UI components.

## 2023-10-25 - SVG Graph Node Lookups
**Learning:** Found a performance bottleneck specific to this codebase's architecture where `links.map` inside `CapabilityGraph.tsx` performed `nodes.find` for both source and target links on every render, causing O(N^2) lookups.
**Action:** When rendering connected network graphs or D3-like SVG elements that map over links, always pre-compute a `Map` (or dictionary) of nodes by their IDs outside the loop to achieve O(1) lookups instead of O(N).

## 2025-03-08 - SVG Graph Node Lookups in React Mappings
**Learning:** Found multiple instances of `O(N^2)` array operations in `BuildExecutionAttestation.tsx` (e.g., using `findIndex` inside `.filter` for deduplication, and `.find` inside a `.map` loop to resolve capability IDs and hover states).
**Action:** Use `Set` for `O(1)` array deduplication and pre-compute `Map` dictionaries for cross-array lookups before mapping over data structures to prevent blocking the main thread during React re-renders.

## 2026-09-07 - SVG Graph Node Lookups in React Mappings
**Learning:** Found multiple instances of `O(N^2)` array operations in `CognitiveIde.tsx` (e.g., using `.find` inside a `.map` loop to resolve capability IDs and hover states).
**Action:** Use `Set` for `O(1)` array deduplication and pre-compute `Map` dictionaries for cross-array lookups before mapping over data structures to prevent blocking the main thread during React re-renders.
## 2025-10-12 - Prevent Re-calculation of Nodes and Links on Hover
**Learning:** React re-evaluates variables defined in the main component body on every render. If these variables require O(N) or O(N^2) searches (like iterating over lists to map nodes and then searching those lists to form links), they will cause significant performance bottlenecks when frequent state updates occur, such as during rapid hover events (`onMouseEnter` / `onMouseLeave`).
**Action:** Always wrap heavy data transformations, complex array mappings, and nested loop iterations in a `useMemo` hook, ensuring that they are only recalculated when their specific dependencies (e.g., source data or layout dimensions) change, rather than on every component render.
