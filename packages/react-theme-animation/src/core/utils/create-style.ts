export const createStyle = (nonce?: string): HTMLStyleElement => {
  const style = document.createElement('style')

  if (nonce !== undefined && nonce !== '') style.nonce = nonce

  return style
}
