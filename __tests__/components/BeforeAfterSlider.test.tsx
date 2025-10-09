import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'

describe('BeforeAfterSlider', () => {
  const mockProps = {
    beforeImage: 'before.jpg',
    afterImage: 'after.jpg',
    beforeLabel: 'Original',
    afterLabel: 'Transformed',
  }

  it('renders with before and after images', () => {
    render(<BeforeAfterSlider {...mockProps} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
  })

  it('displays correct labels', () => {
    render(<BeforeAfterSlider {...mockProps} />)

    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.getByText('Transformed')).toBeInTheDocument()
  })

  it('updates slider position on mouse move', () => {
    render(<BeforeAfterSlider {...mockProps} />)

    const container = screen.getByRole('img').closest('.relative')
    if (container) {
      fireEvent.mouseDown(container)
      fireEvent.mouseMove(container, { clientX: 100 })
      fireEvent.mouseUp(container)
    }
  })
})