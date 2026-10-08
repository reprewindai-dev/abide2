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

## 2024-04-12 - Replacing Array `.find()` loops in Network Visualizer with Map Caches
**Learning:** In highly interactive SVG charts like `CapabilityGraph` featuring complex nested logic mapping Domain to Product to Capabilities (O(N^2) complexity), synchronous operations scanning un-indexed collections block the React render thread and drag performance.
**Action:** When connecting interdependent nodes from disjoint arrays in map or forEach render loops, use `useMemo` to pre-compute Map dictionaries to convert linear `O(N)` scans into `O(1)` operations.
