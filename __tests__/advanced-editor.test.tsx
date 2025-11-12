import React from 'react'
import { render, screen } from '@testing-library/react'
import AdvancedEditorPage from '@/app/editor-advanced/page'

describe('AdvancedEditorPage', () => {
  it('renders filters and layers panels', () => {
    render(<AdvancedEditorPage />)
    expect(screen.getByText(/Filters/i)).toBeInTheDocument()
    expect(screen.getByText(/Layers/i)).toBeInTheDocument()
  })
})


