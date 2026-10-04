---
'@space-man/react-theme-animation': major
---

Ship ESM only and remove the CommonJS exports. Replace `require()` calls with static `import` or dynamic `import()`.

Reduce the published package with shared compiled modules, minified JavaScript, and no source maps. Keep all existing ESM entry points, type declarations, built-in controls, and required dependencies. Validate the compiled exports and controls through public package imports.
