export function wait(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

export function removeBlankKeys(obj: Record<string, unknown>): Record<string, unknown> {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) delete obj[key]
  }
  return obj
}
