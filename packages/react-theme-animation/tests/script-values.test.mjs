import assert from 'node:assert/strict'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

import { serializeScriptValue } from '../src/react/components/serialize-script-value.ts'

await test('bootstrap values remain data inside an HTML script', () => {
  const value = '</script><script>alert("injected")</script>&\u2028\u2029'
  const encoded = serializeScriptValue(value)
  assert.equal(/[<>&\u2028\u2029]/u.test(encoded), false)
  assert.equal(runInNewContext(encoded), value)
  assert.equal(runInNewContext(serializeScriptValue(false)), false)
})
