import { render, screen } from '@testing-library/react'
import App from '../pages'

describe('App', () => {
  it('should render the conversations page', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Mes conversations' })).toBeInTheDocument()
  })
})
