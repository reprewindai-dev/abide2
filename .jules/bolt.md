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

## 2023-10-14 - Replace O(N) array inclusion check inside render mapping with O(1) Set lookup
**Learning:** Checking an array's contents with `.includes` inside a large mapping like `filteredGraphNodes.map(...)` introduces an `O(N * M)` complexity pattern, heavily slowing down large node renders.
**Action:** Use `useMemo` to convert the `highlightedPath` array into a `Set` before the render map starts, thereby reducing the search complexity per node mapping iteration to O(1).

## 2023-11-21 - React useMemo Invalidations via Unmemoized Arrays
**Learning:** Found a performance issue in `CapabilityGraph.tsx` where complex data structures (nodes and links arrays) containing `O(N^2)` lookups were generated on every render. Even worse, other `useMemo` hooks dependent on these arrays were constantly invalidated (re-running on every hover state change) because unmemoized arrays have a new reference on every render.
**Action:** Always wrap heavy list/array generation (like SVG node and link mappings) in a `useMemo` hook, especially if those arrays are used as dependencies for downstream hooks, to prevent widespread cache invalidations and main thread blocking.

## 2026-10-19 - Adjacency Map Node Lookups
**Learning:** Found an `O(E^2)` nested loop iterating over `links` array to map adjacent nodes in `illuminatedNodeIds` inside `CapabilityGraph.tsx`. This caused significant performance drop because it runs on every component re-render when a user hovers elements.
**Action:** Instead of nested `.forEach` over a links array, pre-compute an `adjacencyMap` mapping node IDs to Sets of adjacent node IDs and use it for `O(1)` deep path lookups.
