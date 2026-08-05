import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'
import * as AuthContext from './AuthContext'

describe('ProtectedRoute', () => {
  it('redirects to /login when there is no token', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ token: null })
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login page</div>} />
          <Route path="/dashboard" element={<ProtectedRoute><div>Secret</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders children when a token exists', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({ token: 'abc123' })
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/dashboard" element={<ProtectedRoute><div>Secret</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Secret')).toBeInTheDocument()
  })
})