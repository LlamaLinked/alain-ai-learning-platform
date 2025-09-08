Consolidation and Cleanup – September 2025
=========================================

Summary
- Consolidated provider implementations under `backend/execution/providers/` and updated `backend/execution/execute.ts` to delegate to the shared providers for both streaming and non-streaming.
- Centralized configuration reads via `backend/execution/config.ts` with Encore secret + env fallback.
- Removed duplicate/unused provider code and UI libraries.
- Archived Vite frontends into `attic/` and added CI guardrails to prevent new references.

Details
1) Provider Unification
   - Updated: `backend/execution/execute.ts` now imports `poeProvider` and `openAIProvider` from `./providers`.
   - Removed: `backend/execution/poe-nodejs.ts` (duplicate implementation and unused).
   - Rationale: Single source of truth for provider logic; fixes prior bug where `PoeProvider` referenced a non-existent `mapModelName`.

2) Config Centralization
   - Added: `backend/execution/config.ts` exposing `getPoeApiKey()` and `getOpenAIConfig()` (baseUrl+apiKey).
   - Updated: `backend/execution/providers/{poe,openai}.ts`, `backend/execution/health.ts`, `backend/execution/teacher.ts` to use config helpers.
   - Rationale: Consistent secret/env resolution across services; reduces drift and misconfigurations.

3) Frontend Consolidation
   - Archived: `_legacy_frontend/` and `frontend/` moved to `attic/_legacy_frontend/` and `attic/frontend/`.
   - Updated docs: `README.md`, `HACKATHON_README.md`, `WARP.md` to remove SPA commands and highlight `web/` as the only UI.
   - Workspaces: `package.json` now lists only `backend` and `web`.
   - Rationale: Remove duplication (catalog/player/nav) and standardize on the Next.js app.

4) CI Guardrails
   - Added: `scripts/check-no-legacy-refs.sh` and `.github/workflows/no-legacy-frontends.yml`.
   - Behavior: Fails if PRs add changes under `frontend/` or `_legacy_frontend/`, or introduce code references to those paths outside `attic/`.

Removed/Changed Files (Highlights)
- Removed: `backend/execution/poe-nodejs.ts`, `web/lib/providers/*` (unused duplicates)
- Added: `backend/execution/config.ts`, `docs/consolidation-2025-09.md`, CI workflow and script
- Moved: `_legacy_frontend/` → `attic/_legacy_frontend/`, `frontend/` → `attic/frontend/`

Notes
- No runtime behavior change intended beyond fixing the non-stream Poe execution bug and unifying env handling.
- If you see CI failures about legacy references, replace any path like `frontend/...` with the corresponding `web/...` implementation or update documentation to avoid path-based references.

