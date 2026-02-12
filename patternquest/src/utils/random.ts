export function getRandomItems<T>(items: T[], amount: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, amount);
}
