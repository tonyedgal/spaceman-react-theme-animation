# Release readiness audit

Date: 2026-10-04. Implementation reviewed at `bb3d62e` on `feat/oxc-theme-transitions`. User-selected baseline: merge-base with `main`, `2d4fed20d3bb2786e068212026f05560d916f518`. Comparison command: `git diff 2d4fed20d3bb2786e068212026f05560d916f518...HEAD`. Docs created after this review do not close implementation findings.

## Decision

**Do not publish yet.** Two confirmed implementation defects block release. The pending Changesets plan the library's next version as `3.0.0`. The current manifest remains `2.2.0`. No versioning or publishing was performed.

## Standards review

| Finding                                     | Evidence                                                                                                                                                                                                          | Required action                                                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| P1: React 17 contract is false              | `packages/react-theme-animation/package.json` advertises React and React DOM >=17. `src/react/hooks/use-hydrated.ts` imports and calls `useSyncExternalStore`, introduced in React 18. The main hook calls it.    | Raise both minimums to 18 or use a compatibility shim. Test the declared minimum. See [React 18](https://react.dev/blog/2022/03/29/react-v18). |
| Server import boundary is not covered       | `scripts/mark-react-client.mjs` marks only `/react`. A root import with `node --conditions=react-server` fails inside Motion because server React has no `createContext`. `/tanstack` loads under that condition. | Use `/tanstack` and `/core` for server helpers. Test a real Next server/client boundary. This is not established as a new branch regression.   |
| Release CI omits artifact and browser gates | `.github/workflows/publish.yml` runs normal package imports, units, and types, but no browser suite or extracted-tarball consumer.                                                                                | Require equivalent pre-release evidence or add CI gates. Local evidence exists, but CI does not preserve it.                                   |
| npm authorization is external               | The workflow has OIDC permission and package provenance settings. The repository does not show the npm trusted-publisher configuration.                                                                           | Verify the external publisher matches the workflow identity before publishing. Do not treat dry-run output as authentication evidence.         |

No other confirmed standards violation was reported. The baseline smell review did not identify a concrete blocker beyond these contracts and validation boundaries.

## Specification review

| Finding                                  | Requirement and evidence                                                                                                                                                                                                                                                  | Required action                                                                                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1: supported consumers must work        | The retained public controls/providers now use a React 18-only hook despite a >=17 manifest.                                                                                                                                                                              | Resolve the same React minimum issue recorded by Standards. It is one defect, not two.                                                                                    |
| P2: failed storage writes poison retries | The documented transition contract preserves state updates. `use-theme-animation.ts` updates `requestedTheme`/`requestedColorTheme` before commit. `localStorage.setItem` can throw before React state changes. A retry sees the requested destination and returns early. | Treat persistence as best effort or recover requested refs after failure without overwriting newer requests. Add failure-and-retry coverage for mode and palette changes. |
| Runtime SSR evidence is incomplete       | The browser fixtures run in Vite. Next and TanStack examples compile, but the suite does not prove real framework hydration/navigation.                                                                                                                                   | Test the packed package in an actual Next SSR/hydration flow. Add equivalent TanStack runtime evidence for the cookie and script setups.                                  |

Reproduction of the storage failure against the compiled package: start at palette `default`; make `Storage.prototype.setItem` throw `SecurityError`; await `switchColorTheme('ocean', true)` and catch the rejection; restore storage; retry the same call. Result: palette remains `default`, and `color-theme` remains unset. This was observed in Chromium, not inferred from the code alone. Storage reads in the hook also lack a failure guard, so blocked storage is not a supported fallback today.

No confirmed missing animation feature or unwanted removal of the controls was found. The handoff comparison confirms that UI-Theme already has most animation features.

## Dependency security

The fresh production workspace audit reports 3 critical, 35 high, 33 moderate, and 9 low findings. Critical findings are in the private Next.js example. No reported path points to the library importer. The examples do not ship in the npm archive. See [dependency audit](release-dependency-audit.md) for advisory links and scope. Fix the affected dependencies before deploying the examples. This is an additional workspace release/deployment gate, separate from the two confirmed library defects.

## Other existing implementation gaps

| Gap                               | Status                                                                                                                                                                                             | Release treatment                                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Selector customization            | `ThemeSelectorProps` accepts `className`, `placeholder`, `themeLabel`, and `colorThemeLabel`. The view ignores these props and hardcodes the placeholder. This also exists at the review baseline. | Implement supported customization or remove/deprecate unsupported promises. Do not claim these props work.               |
| Provider-backed selector callback | `ThemeSelectorWithContext` forwards only `colorThemes` and provider state. The control's `onColorThemeChange` is not notified in this path.                                                        | Decide whether the control callback or provider callback owns notifications, then document and test it.                  |
| Minimum dependency matrix         | Tests use the locked React 19, Motion 12, and Radix 2 versions. They do not prove all advertised lower versions.                                                                                   | Check React minimum first. Run a minimal consumer with the lowest claimed UI peers, or narrow support based on evidence. |
| Firefox visual skips              | 11 browser checks skip unsupported screenshot assertions or redundant large-snapshot checks. Behavioural coverage still runs.                                                                      | Retain the stated limitation. Do not claim every visual assertion passed on Firefox.                                     |
| Performance guarantee             | Geometry, timing, lifecycle, and rendered corners are tested. No universal frame-rate or compositor-only guarantee follows.                                                                        | Keep the current documentation limits. Profile target hardware before making performance claims.                         |

## Evidence already available

| Check                             | Result                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Oxlint and Oxfmt                  | Passed after the ESM changes.                                                                                       |
| Workspace types                   | All four packages passed.                                                                                           |
| Production builds                 | Library, Next example, and both TanStack examples passed.                                                           |
| Import smoke checks               | Root and all public subpaths passed. Shared controls/providers retain identity between entries.                     |
| Unit checks                       | Both runtime logo-validation and script-serialization checks passed.                                                |
| Published type surface            | Local and extracted-tarball declarations compiled.                                                                  |
| Compiled browser suite            | 244 passed, 11 skipped, across Chromium DPR 1–3, WebKit, and Firefox.                                               |
| Artifact                          | 17 files. ESM entries, shared chunks, `.d.ts`, manifest, README, license. No maps, CJS, examples, source, or tests. |
| Package size before this doc pass | 20,851 bytes compressed; 78,255 bytes unpacked. README edits require a fresh final measurement.                     |
| Changesets status                 | Planned library release 3.0.0. Example Next gets a private version update. Private apps do not publish.             |

These checks were completed in this session before the docs pass. No implementation changed during the docs pass. Fresh formatting and link checks cover the documentation. Final release checks must be repeated after blocker fixes and version generation.

## Documentation audit

| File                                                       | Action                                                                                                                                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                | Link the transition guide, planned v3 notes, readiness audit, and UI-Theme handoff.                                                                                         |
| `packages/react-theme-animation/README.md`                 | Keep ESM guidance. Clarify client/server imports and required UI dependencies. Replace the package-relative guide link, which breaks in the tarball, with a repository URL. |
| `MIGRATION.md`                                             | Add CommonJS-to-ESM migration, module output changes, unchanged control availability, and server-only import paths.                                                         |
| `RELEASE_NOTES_v3.md`                                      | Add unpublished v3 notes. State the major reason and all added transition APIs.                                                                                             |
| `RELEASING.md`                                             | Document compiled-build checks, packed consumers, current CI coverage, planned version, and authentication limits.                                                          |
| `CONTRIBUTING.md`                                          | Make the build-first requirement and all release checks explicit.                                                                                                           |
| Three framework guides                                     | State ESM use. Keep Next client wrappers. Separate server helpers in TanStack docs. Correct the Vite blocked-storage claim.                                                 |
| `packages/react-theme-animation/docs/theme-transitions.md` | State that compiled entries need a build before browser/gallery checks.                                                                                                     |
| Three example READMEs                                      | Replace app-local npm installation instructions with root pnpm workspace commands. State the example features and link the transition guide.                                |
| `SUPPORT.md`                                               | Request module format, storage availability, browser, DPR/zoom, trigger details, and transition settings for animation reports.                                             |
| `SECURITY.md`                                              | Reviewed. No release-specific change needed.                                                                                                                                |
| `RELEASE_NOTES_v2.md`                                      | Preserve as a historical dual-module release record.                                                                                                                        |
| Existing changelogs                                        | Preserve. Changesets generates the v3 entries during versioning.                                                                                                            |
| Existing Changesets                                        | Keep major ESM entry and pending feature entries. Recheck the generated release description after versioning.                                                               |

## Remaining release sequence

1. Resolve React minimum and storage failure/retry defects. Upgrade vulnerable example dependencies before their deployment.
2. Resolve or explicitly disposition selector customization and callback gaps.
3. Test the minimum dependency versions and actual framework hydration.
4. Rerun build, quality, workspace types, unit/type/import checks, compiled browser checks, and extracted-tarball tests.
5. Generate the Changesets version and changelog on the release branch. Inspect the new version, lockfile, and package metadata.
6. Verify npm trusted publishing and provenance configuration externally.
7. Pack and inspect the versioned archive. Publish only after the required approval.

## Review method

The code-review skill runs Standards and Spec separately. Both reports are preserved above; shared findings are identified without merging the review axes. `docs/agents/issue-tracker.md` is absent. The skill's tracker setup command is `/setup-matt-pocock-skills`; no tracker installation was needed for this audit because the user supplied the attached chat and current requirements. No task messages, pull requests, pushes, or publications were sent by this audit. The UI-Theme handoff is a prepared document.
