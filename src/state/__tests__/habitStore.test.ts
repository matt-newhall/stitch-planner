jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}))

import useHabitStore from '../habitStore'

beforeEach(() => {
  useHabitStore.setState({ stacks: [], completedHabits: {} })
})

describe('toggleHabitCompletion', () => {
  it('marks a stack as completed for a given date', () => {
    useHabitStore.getState().toggleHabitCompletion('stack-1', '2026-02-19')
    expect(useHabitStore.getState().completedHabits['2026-02-19']).toContain('stack-1')
  })

  it('removes the stack id when toggled a second time', () => {
    useHabitStore.setState({ completedHabits: { '2026-02-19': ['stack-1'] } })
    useHabitStore.getState().toggleHabitCompletion('stack-1', '2026-02-19')
    expect(useHabitStore.getState().completedHabits['2026-02-19']).not.toContain('stack-1')
  })

  it('does not affect completions on other dates', () => {
    useHabitStore.setState({ completedHabits: { '2026-02-18': ['stack-1'] } })
    useHabitStore.getState().toggleHabitCompletion('stack-1', '2026-02-19')
    expect(useHabitStore.getState().completedHabits['2026-02-18']).toContain('stack-1')
  })

  it('can complete multiple stacks on the same date', () => {
    useHabitStore.getState().toggleHabitCompletion('stack-1', '2026-02-19')
    useHabitStore.getState().toggleHabitCompletion('stack-2', '2026-02-19')
    const completed = useHabitStore.getState().completedHabits['2026-02-19']
    expect(completed).toContain('stack-1')
    expect(completed).toContain('stack-2')
  })
})
