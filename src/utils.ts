export function padZero(x: number): string {
  if (x === 0) return '000'

  let out = `${x}`
  const numOfDigits = Math.floor(Math.log10(x)) + 1
  for (let i = 0; i < 3 - numOfDigits; ++i) {
    out = '0' + out
  }

  return out
}

export function formatPrice(x: number): string {
  let stack = [] as string[]

  while (x > 0) {
    if (x / 1000 < 1) stack.push(`${x % 1000}`)
    else stack.push(padZero(x % 1000))

    x = Math.floor(x / 1000)

    if (x > 0) stack.push(',')
  }

  if (stack.length === 0) stack.push('0')

  return stack.reverse().join('')
}

const markers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩']

export function getMarker(x: number): string {
  return markers[x - 1]
}
