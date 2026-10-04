import { useSyncExternalStore } from 'react'

function subscribe(): () => void {
  return (): void => {}
}

function clientSnapshot(): true {
  return true
}

function serverSnapshot(): false {
  return false
}

export function useHydrated(): boolean {
  return useSyncExternalStore<boolean>(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  )
}
