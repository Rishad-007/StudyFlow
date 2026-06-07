const GOLDEN_ANGLE = 137.508

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

export function generateUniqueColors(count: number, seed?: string): string[] {
  const offset = seed ? hashCode(seed) * 0.001 : 0
  const saturation = 65
  const lightness = 55
  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    const hue = (offset + i * GOLDEN_ANGLE) % 360
    colors.push(hslToHex(hue, saturation, lightness))
  }
  return colors
}
