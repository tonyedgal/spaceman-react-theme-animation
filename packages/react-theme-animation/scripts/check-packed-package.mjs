import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import { z } from 'zod'

const packageRoot = process.cwd()

const scratch = mkdtempSync(resolve(tmpdir(), 'spaceman-package-'))

const manifest = z
  .object({ devDependencies: z.record(z.string(), z.string()) })
  .parse(JSON.parse(readFileSync('package.json', 'utf8')))

const archiveSchema = z
  .array(
    z.object({
      filename: z.string(),
      files: z.array(z.object({ path: z.string() })),
    }),
  )
  .min(1)

try {
  const packed = archiveSchema.parse(
    JSON.parse(
      execFileSync(
        'npm',
        ['pack', '--json', '--ignore-scripts', '--pack-destination', scratch],
        { encoding: 'utf8' },
      ),
    ),
  )

  const archive = packed[0]
  assert.ok(
    archive.files.every((file) =>
      /^(dist\/|README\.md$|LICENSE$|package\.json$)/u.test(file.path),
    ),
  )
  assert.ok(
    archive.files.every((file) => !/\.(?:cjs|cts|map)$/u.test(file.path)),
  )

  for (const minimum of [true, false]) {
    const consumer = resolve(scratch, minimum ? 'minimum' : 'current')
    cpSync('tests/types', resolve(consumer, 'types'), { recursive: true })
    cpSync('scripts/smoke-subpath-imports.mjs', resolve(consumer, 'smoke.mjs'))
    const versions = manifest.devDependencies
    writeFileSync(
      resolve(consumer, 'package.json'),
      JSON.stringify({
        private: true,
        type: 'module',
        dependencies: {
          '@space-man/react-theme-animation': resolve(
            scratch,
            archive.filename,
          ),
          react: minimum ? '18.0.0' : versions.react,
          'react-dom': minimum ? '18.0.0' : versions['react-dom'],
          motion: minimum ? '12.0.0' : versions.motion,
          '@radix-ui/react-select': minimum
            ? '2.0.0'
            : versions['@radix-ui/react-select'],
          '@types/react': minimum ? '^18.3.0' : versions['@types/react'],
          '@types/react-dom': minimum
            ? '^18.3.0'
            : versions['@types/react-dom'],
        },
      }),
    )
    execFileSync(
      'npm',
      ['install', '--ignore-scripts', '--no-audit', '--no-fund'],
      { cwd: consumer, stdio: 'pipe' },
    )
    execFileSync(process.execPath, ['smoke.mjs'], {
      cwd: consumer,
      stdio: 'inherit',
    })
    writeFileSync(
      resolve(consumer, 'ssr.mjs'),
      `import React from 'react'; import {renderToString} from 'react-dom/server'; import {SpacemanThemeProvider,ThemeSelector} from '@space-man/react-theme-animation'; import assert from 'node:assert/strict'; assert.ok(renderToString(React.createElement(SpacemanThemeProvider,{defaultTheme:'light'},React.createElement('span',null,'ready'))).includes('ready')); const selector=renderToString(React.createElement(ThemeSelector,{colorThemes:['default','ocean'],currentColorTheme:'',className:'custom-selector',placeholder:'Palette placeholder',colorThemeLabel:'Palette label'})); for(const text of ['custom-selector','Palette placeholder','Palette label']) assert.ok(selector.includes(text));`,
    )
    execFileSync(process.execPath, ['ssr.mjs'], {
      cwd: consumer,
      stdio: 'inherit',
    })
    writeFileSync(
      resolve(consumer, 'tsconfig.json'),
      JSON.stringify({
        compilerOptions: {
          target: 'ES2020',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          strict: true,
          skipLibCheck: false,
          noEmit: true,
          jsx: 'react-jsx',
        },
        include: ['types/*.ts'],
      }),
    )
    execFileSync(
      process.execPath,
      [
        resolve(packageRoot, '../../node_modules/typescript/bin/tsc'),
        '--noEmit',
        '-p',
        resolve(consumer, 'tsconfig.json'),
      ],
      { stdio: 'inherit' },
    )
    console.log(
      `Packed consumer passed: ${minimum ? 'React 18.0 / Motion 12.0.0 / Radix 2.0 minimums' : 'current dependencies'}`,
    )
  }
} finally {
  rmSync(scratch, { recursive: true, force: true })
}
