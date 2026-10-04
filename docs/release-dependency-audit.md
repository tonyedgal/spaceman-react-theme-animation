# Production dependency audit

## Current result after dependency updates

On 2026-10-05, a fresh `pnpm audit --prod --json` exits 0 with no critical, high, moderate, low, or informational findings. The lockfile contains the updated Next 16.3.8, React 19.3, Vite 8.3.2, and current TanStack dependencies. TypeScript remains 5.9.3 for tsup compatibility.

The latest Netlify plugin still reports an upstream optional-peer mismatch: `unstorage` accepts `@netlify/blobs` 6–10, while `@netlify/dev` requires 11. No override or peer-warning suppression was added. Both TanStack apps build; runtime checks cover their theme flows. This warning is in private development tooling, which does not ship in the library archive.

## Historical audit before updates

Date: 2026-10-04. Command: `pnpm audit --prod --json`, run from the workspace root. The command exited 1. This includes dependencies of private example applications. It is not a browser bundle measurement or a claim that example files ship in the library.

The pnpm summary reports 3 critical, 35 high, 33 moderate, and 9 low findings. The response contains 74 advisory records; summary totals and advisory counts are not interchangeable. No reported path points to the library importer. Arbitrary consumer peer versions are outside this result.

| Module                   | Advisory records | Highest severity |
| ------------------------ | ---------------: | ---------------- |
| next                     |               32 | critical         |
| postcss                  |                4 | high             |
| esbuild                  |                1 | low              |
| vite                     |                2 | high             |
| undici                   |               21 | high             |
| js-yaml                  |                4 | high             |
| ws                       |                1 | high             |
| @babel/core              |                1 | low              |
| sharp                    |                2 | high             |
| nanoid                   |                2 | high             |
| browserslist             |                2 | high             |
| baseline-browser-mapping |                1 | moderate         |
| braces                   |                1 | high             |

## Critical example findings

- [Next.js is vulnerable to RCE in React flight protocol](https://github.com/advisories/GHSA-9qr9-h5gf-34mp). Reported module: `next`. Reported patched range: `>=15.3.6`. Path: `apps__examples__example-next>next`.
- [Next.js: Unauthenticated Remote Code Execution on windows-hosted servers](https://github.com/advisories/GHSA-p293-qw3h-jr36). Reported module: `next`. Reported patched range: `>=15.5.24`. Path: `apps__examples__example-next>next`.
- [Next.js: Unauthenticated Remote Code Execution in Image Optimization API when AVIF files are used](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4). Reported module: `next`. Reported patched range: `>=15.5.24`. Path: `apps__examples__example-next>next`.

## Follow-up completed

Upgrade the affected example/framework dependencies and their vulnerable transitive dependencies. Review each advisory against the deployed configuration. Rerun the production audit, builds, and runtime checks. Do not deploy the example servers with these known critical findings. The dependency update pass closed the reported production findings. The section above preserves the original evidence; it does not describe the current lockfile.
