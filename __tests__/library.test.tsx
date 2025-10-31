import React from 'react'
import { render, screen } from '@testing-library/react'
import LibraryPage from '@/app/library/page'

jest.mock('@/lib/instantdb', () => ({
  db: {
    query: () => ({
      where: () => ({
        onSnapshot: (cb: any) => {
          cb({ items: [] })
          return { cancel: () => {} }
        },
      }),
    }),
  },
}))

describe('LibraryPage', () => {
  it('renders header', () => {
    render(<LibraryPage />)
    expect(screen.getByText(/Curated Image Library/i)).toBeInTheDocument()
  })
})


