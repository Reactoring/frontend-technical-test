import { render, screen } from '@testing-library/react'
import NotFoundPage from '../pages/404'

describe('Not found page', () => {
  it('should explain the page does not exist and link back to the conversations', () => {
    render(<NotFoundPage />)

    expect(screen.getByText('Page introuvable')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Retour à mes conversations' })).toHaveAttribute('href', '/')
  })
})
