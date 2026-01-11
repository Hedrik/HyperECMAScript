# Active Context

## Current Work Focus
Implementing a sophisticated prototype-based manipulation framework with layered architecture, multi-select, and full API support. This follows a comprehensive planning phase where the core architecture was shifted from a standalone framework to an `HTMLElement` prototype extension.

## Recent Changes
- Finalized design for prototype-based manipulation framework.
- Defined three-layer architecture: `document`, `template`, and `page`.
- Implemented core framework in `src/framework.js`.
- Added global keyboard shortcuts:
    - **Ctrl + M**: Toggle Manipulation Mode.
    - **Ctrl + C / X / V**: Copy / Cut / Paste selection.
    - **F1 / F2 / F3**: Switch active layer.
- Created interactive examples in `examples/` directory.
- Designed comprehensive API for layer and element management.
- Designed cut/copy/paste system with cross-layer support and element serialization.
- Created implementation checkpoint to ensure continuity.

## Implementation Checkpoint (2026-01-11)

### Architecture Decisions
- **Prototype Extension**: `HTMLElement.prototype` will be extended to provide automatic inheritance of framework capabilities.
- **Layered Visibility**: Only the active layer is selectable/visible during manipulation mode; all layers visible in normal mode.
- **Layer Elements**: Non-visible layer-level elements will act as intermediaries in the event propagation chain.
- **Property System**: Elements will have `uid` (read-only), `name` (unique in layer), and `ordinal` (ordering) properties using standard ECMAScript getters/setters.

### Implementation Plan
1. **Foundation**: Implement `window.ManipulationFramework` global state and the element serialization/clipboard system.
2. **Prototype Extensions**: Add API methods and properties to `HTMLElement.prototype`.
3. **Layer Management**: Implement API for adding, removing, and duplicating layers.
4. **Element Management**: Implement API for adding, removing, and duplicating elements within layers.
5. **Event System**: Implement the layered event propagation logic (Element -> Layer -> Next Layer).
6. **Interaction Logic**: Implement mouse/keyboard handlers for move, resize, duplicate, and multi-select.
7. **Clipboard Operations**: Implement cut/copy/paste logic with cross-layer support.

## Next Steps
1. Initialize the global `ManipulationFramework` state in `src/framework.js`.
2. Implement the serialization and clipboard foundation.
3. Begin extending `HTMLElement.prototype`.
