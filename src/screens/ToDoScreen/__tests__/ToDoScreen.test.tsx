import { render, screen, fireEvent } from '@testing-library/react-native'
import ToDoScreen from '../ToDoScreen'

describe('ToDoScreen', () => {
  it('renders the task input', () => {
    render(<ToDoScreen />)
    expect(screen.getByPlaceholderText('Add a task...')).toBeTruthy()
  })

  it('adds a task when submitted', () => {
    render(<ToDoScreen />)
    const input = screen.getByPlaceholderText('Add a task...')
    fireEvent.changeText(input, 'Buy groceries')
    fireEvent(input, 'submitEditing')
    expect(screen.getByText('Buy groceries')).toBeTruthy()
  })
})
