## 2026-08-04 - React Array Render Re-renders
**Learning:** Found an opportunity where complex list operations (sorting and filtering) were running on every re-render in `VnpAnalyticsCards.tsx`.
**Action:** Always wrap heavy list mapping, filtering, and sorting in React `useMemo` hooks with proper dependencies to avoid unnecessary main thread blocking in heavily reactive UI components.

## 2023-10-25 - SVG Graph Node Lookups
**Learning:** Found a performance bottleneck specific to this codebase's architecture where `links.map` inside `CapabilityGraph.tsx` performed `nodes.find` for both source and target links on every render, causing O(N^2) lookups.
**Action:** When rendering connected network graphs or D3-like SVG elements that map over links, always pre-compute a `Map` (or dictionary) of nodes by their IDs outside the loop to achieve O(1) lookups instead of O(N).

## 2025-02-27 - React Component Nested O(N*E) Array Lookup
**Learning:** Found a performance bottleneck specific to this codebase's architecture where `links.some` inside the `nodes.map` loop for rendering SVG nodes in `CapabilityGraph.tsx` caused an O(V*E) complexity check on every render when interacting with hover events.
**Action:** Always pre-compute relationships that require iterating over dependent arrays (e.g. graph edges/links) into an O(1) lookup structure (like a `Set` or `Map`) wrapped in a `useMemo` outside of node rendering loops to achieve O(V+E) performance rather than O(V*E).
