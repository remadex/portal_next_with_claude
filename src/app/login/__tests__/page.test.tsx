import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LoginPage from '../page'
import { useAuth } from '@portal/app/contexts/AuthContext'

// Mock the AuthContext
const mockLogin = vi.fn()

vi.mock('@portal/app/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isLoading: false,
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    mockLogin.mockReset()
  })

  it('renders login form with user ID input initially', () => {
    render(<LoginPage />)
    
    expect(screen.getByRole('textbox', { name: /user id/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    expect(screen.queryByText(/enter pin/i)).not.toBeInTheDocument()
  })

  it('shows PIN input after entering user ID', async () => {
    render(<LoginPage />)
    
    const userIdInput = screen.getByRole('textbox', { name: /user id/i })
    await userEvent.type(userIdInput, 'testuser')
    
    fireEvent.submit(screen.getByRole('button', { name: /continue/i }))
    
    expect(screen.getByText(/enter pin/i)).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('handles login success', async () => {
    render(<LoginPage />)
    
    // Enter user ID
    await userEvent.type(screen.getByRole('textbox', { name: /user id/i }), 'testuser')
    fireEvent.submit(screen.getByRole('button', { name: /continue/i }))
    
    // Enter PIN
    const pinInputs = screen.getAllByLabelText(/pin digit \d/i)
    await userEvent.type(pinInputs[0], '1')
    await userEvent.type(pinInputs[1], '2')
    await userEvent.type(pinInputs[2], '3')
    await userEvent.type(pinInputs[3], '4')
    
    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', '1234')
    })
  })

  it('handles login error', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))
    
    render(<LoginPage />)
    
    // Enter user ID
    await userEvent.type(screen.getByRole('textbox', { name: /user id/i }), 'testuser')
    fireEvent.submit(screen.getByRole('button', { name: /continue/i }))
    
    // Enter PIN
    const pinInputs = screen.getAllByLabelText(/pin digit \d/i)
    await userEvent.type(pinInputs[0], '1')
    await userEvent.type(pinInputs[1], '2')
    await userEvent.type(pinInputs[2], '3')
    await userEvent.type(pinInputs[3], '4')
    
    // Submit form
    fireEvent.submit(screen.getByRole('button', { name: /login/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid user id or pin/i)).toBeInTheDocument()
    })
  })

  it('allows changing user ID', async () => {
    render(<LoginPage />)
    
    // Enter initial user ID
    await userEvent.type(screen.getByRole('textbox', { name: /user id/i }), 'testuser')
    fireEvent.submit(screen.getByRole('button', { name: /continue/i }))
    
    // Click change user ID button
    fireEvent.click(screen.getByRole('button', { name: /change user id/i }))
    
    expect(screen.getByRole('textbox', { name: /user id/i })).toBeInTheDocument()
    expect(screen.queryByText(/enter pin/i)).not.toBeInTheDocument()
  })
}) 