import { render, screen, fireEvent } from '@testing-library/react-native'
import HabitCard from '../HabitCard'
import { HabitCadenceOption } from '../../../types'
import type { HabitStack } from '../../../types'

const mockStack: HabitStack = {
  id: 'stack-1',
  habits: [
    { id: 'habit-1', behaviour: 'read for 10 minutes', time: 'when I wake up', location: 'my bedroom' },
    { id: 'habit-2', behaviour: 'journal', time: '', location: '' },
  ],
  cadence: { type: HabitCadenceOption.Daily, days: [0, 1, 2, 3, 4, 5, 6] },
  startDate: '2026-01-01',
}

describe('HabitCard', () => {
  it('renders the anchor habit sentence', () => {
    render(<HabitCard habitStack={mockStack} isCompleted={false} onToggle={jest.fn()} />)
    // 'read for 10 minutes' appears in both anchor and stacked reference
    expect(screen.getAllByText('read for 10 minutes')).toHaveLength(2)
    expect(screen.getByText('when I wake up')).toBeTruthy()
    expect(screen.getByText('my bedroom')).toBeTruthy()
  })

  it('renders stacked habits', () => {
    render(<HabitCard habitStack={mockStack} isCompleted={false} onToggle={jest.fn()} />)
    expect(screen.getByText('journal')).toBeTruthy()
  })

  it('calls onToggle when the card is pressed', () => {
    const onToggle = jest.fn()
    render(<HabitCard habitStack={mockStack} isCompleted={false} onToggle={onToggle} />)
    fireEvent.press(screen.getByText('my bedroom'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when pressed in completed state', () => {
    const onToggle = jest.fn()
    render(<HabitCard habitStack={mockStack} isCompleted={true} onToggle={onToggle} />)
    fireEvent.press(screen.getByText('my bedroom'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})
