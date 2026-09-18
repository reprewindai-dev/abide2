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

## 2023-10-24 - [Avoid O(E^2) Array Searches in Graph Node Illumination]
**Learning:** Found a major performance bottleneck where `illuminatedNodeIds` continuously triggered O(E^2) array iterations nested within `links.forEach()` to traverse graph nodes. Additionally, graph `links` were recalculated on every render with O(N) `.find()` searches, causing severe main thread blocking for complex `CapabilityGraph` instances.
**Action:** Always prefer `Map` dictionaries mapped by key when joining domain arrays. Using pre-computed Map dictionaries and converting edge iterations to O(1) adjacency hash map lookups drastically improves graph performance on interactive visualizations.
