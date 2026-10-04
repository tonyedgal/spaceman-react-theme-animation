/** Storage is optional persistence; failures must not prevent theme updates. */
export function readThemeStorage(key: string): string | null {
  try {
    return 'window' in globalThis ? window.localStorage.getItem(key) : null
  } catch {
    return null
  }
}

export function writeThemeStorage(key: string, value: string): void {
  try {
    if ('window' in globalThis) window.localStorage.setItem(key, value)
  } catch {
    // Private browsing, blocked storage, and quota limits keep in-memory state.
    return
  }
}
