export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getRandomArrayItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}
