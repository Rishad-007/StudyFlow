export function useGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return { greeting: 'Good morning', timeOfDay: 'morning' as const }
  }
  if (hour < 17) {
    return { greeting: 'Good afternoon', timeOfDay: 'afternoon' as const }
  }
  return { greeting: 'Good evening', timeOfDay: 'evening' as const }
}
