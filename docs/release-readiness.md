# Release readiness

Date: 2026-10-05. Branch: `feat/oxc-theme-transitions`. The original review used the merge-base with `main`, `2d4fed20d3bb2786e068212026f05560d916f518`. This report includes the dependency and implementation fixes that followed that review.

## Decision

The confirmed implementation blockers are resolved. Changesets plans `3.0.0`; the manifest stays at `2.3.0` until release tooling generates the version. Version generation, external npm publisher verification, and publication approval remain. Nothing was pushed or published.

## Findings and resolution

| Review axis                 | Original finding                                                                | Resolution and evidence                                                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Standards and specification | React >=17 conflicted with `useSyncExternalStore`.                              | React and React DOM now require >=18. Extracted consumers pass with React 18.0 and current React 19.3.                                                                                                                              |
| Specification               | Storage failures prevented updates and poisoned retries.                        | Reads and writes are best effort in `theme-storage.ts`. Five provider paths pass blocked-storage and restored-persistence browser tests.                                                                                            |
| Follow-up runtime check     | Saved palettes and system preferences differed during hydration.                | The hook exposes server defaults until hydration finishes. Compiled-browser tests render real server markup and hydrate with saved values and a dark system preference. The production Next app passes the same saved-palette flow. |
| API review                  | Selector customization and callback props were ignored.                         | The selector forwards class, placeholder, and palette label. Labels connect to the trigger. Provider-backed selectors call their own callback once. `themeLabel` is deprecated because the selector changes palettes.               |
| Minimum peer check          | Earliest Motion 11 could not resolve its animation entry.                       | Motion now requires >=12. React 18.0 / Motion 12.0 / Radix 2.0 pass imports, SSR, and declarations from the npm archive.                                                                                                            |
| Standards                   | Release CI lacked browser and archive gates.                                    | The workflow now runs browser checks, extracted-package matrices, and production auditing before Changesets. Actions were updated; Changesets v2 uses its renamed script inputs. Remote CI has not run locally.                     |
| Security                    | Production audit reported 3 critical, 35 high, 33 moderate, and 9 low findings. | Updated dependencies report zero findings at every severity. See [audit history](release-dependency-audit.md).                                                                                                                      |
| Runtime verification        | Real framework hydration and navigation were untested.                          | Production Next and both TanStack development servers pass palette/mode changes, navigation, and reload. The cookie example also verifies cookie-derived HTML and persisted server writes.                                          |

The framework checks use the workspace build. The extracted archive is checked separately in Node and TypeScript. These checks do not claim that an extracted archive ran inside every framework.

## Verified checks

| Check                          | Result                                                                                                                                                                                                                                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Oxlint and Oxfmt               | Passed. No rules were disabled to resolve dependency or implementation failures.                                                                                                                                                                                                                             |
| Workspace types and builds     | Library, Next, and both TanStack examples pass.                                                                                                                                                                                                                                                              |
| Import, unit, and public types | Public entries share identity; both unit checks and declaration fixtures pass.                                                                                                                                                                                                                               |
| Extracted archive              | Minimum and current peers pass imports, declarations with library checking enabled, and server rendering. Archive excludes examples, tests, source maps, and CommonJS.                                                                                                                                       |
| Browser regressions            | 340 cases: 329 passed across the full run and sequential correction run; 11 intentional visual skips. The first run used an invalid JSX transform in six new SSR fixtures. A concurrent focused run also removed one trace file. Corrected fixtures and all seven affected cases pass when run sequentially. |
| Framework runtime              | Next production and both TanStack development theme flows pass without hydration or page errors.                                                                                                                                                                                                             |
| Production security            | Zero critical, high, moderate, low, and informational findings.                                                                                                                                                                                                                                              |
| Package size                   | 21,594 bytes compressed; 80,339 bytes unpacked; 17 files. Required external dependencies install separately.                                                                                                                                                                                                 |
| Changesets                     | The library's planned release remains 3.0.0. Private example apps do not publish.                                                                                                                                                                                                                            |

Browser projects cover Chromium DPR 1, 2, and mobile DPR 3, plus WebKit and Firefox. The Firefox skips remain explicit. These checks do not establish a universal frame-rate guarantee.

## Dependency limits

All retained direct npm dependencies use the current releases except TypeScript. TypeScript 7.0.2 breaks tsup's declaration compiler API. TypeScript 6.0.3 fails because tsup internally supplies a deprecated `baseUrl`. TypeScript stays at the latest compatible 5.9.3; no deprecation errors were silenced. Replace or update the declaration builder before adopting a newer compiler.

The Netlify development plugin has one upstream optional-peer mismatch between `unstorage` and `@netlify/blobs`. No override or warning suppression was added. The production audit is clean. Example dependencies do not ship in the library archive.

The root export remains a client API under React's server condition. Use `/core` and `/tanstack` for server-only helpers. Next providers stay inside a local client wrapper. The examples contained stale physical dependency folders before the upgrades; fresh installs from the lockfile verified the actual new router versions.

## Remaining release steps

1. Generate the Changesets version and changelog on the release branch. Check the version is 3.0.0 and all pending notes are included.
2. Run the release checks from [RELEASING.md](../RELEASING.md) against the versioned artifact. Run the updated workflow remotely before release.
3. Verify npm's trusted-publisher identity matches the repository and workflow. Local packaging cannot prove external authorization or provenance.
4. Inspect the final archive and publish only with explicit release approval.

The [UI-Theme handoff](ui-theme-handoff.md) includes storage, hydration, selector, and validation fixes. It is prepared for that agent; no message was sent and no UI-Theme files were changed.
