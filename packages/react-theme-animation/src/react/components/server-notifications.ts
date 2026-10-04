export function notifyServerChange<T extends string>(
  notify: ((value: T) => void | Promise<void>) | undefined,
  value: T,
): void {
  const result = notify?.(value)

  if (result instanceof Promise) {
    void result.catch(console.error)
  }
}
