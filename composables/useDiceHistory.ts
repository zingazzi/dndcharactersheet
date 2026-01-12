export interface DiceRoll {
  id: string
  timestamp: Date
  title: string
  roll: number
  modifier: number
  total: number
}

export const useDiceHistory = () => {
  const history = useState<DiceRoll[]>('dice-history', () => [])

  const addRoll = (title: string, roll: number, modifier: number) => {
    const total = roll + modifier
    history.value.push({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      title,
      roll,
      modifier,
      total,
    })
    // Keep only the most recent 50 rolls
    if (history.value.length > 50) {
      history.value = history.value.slice(-50)
    }
  }

  const clearHistory = () => {
    history.value = []
  }

  const getRecentRolls = () => {
    // Return all rolls (already limited to 50), newest first
    return [...history.value].reverse()
  }

  return {
    history: readonly(history),
    addRoll,
    clearHistory,
    getRecentRolls,
  }
}
