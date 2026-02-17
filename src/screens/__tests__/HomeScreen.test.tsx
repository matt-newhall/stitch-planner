import { render, screen } from '@testing-library/react-native'
import HomeScreen from '../ToDoScreen'

describe('HomeScreen', () => {
  it('renders the title', () => {
    render(<HomeScreen />)
    expect(screen.getByText('Home')).toBeTruthy()
  })
})
