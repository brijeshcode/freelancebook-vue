// src/services/authService.ts
import { post, get, getCSRFToken } from './axios'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Login function
export const login = async (credentials: LoginCredentials) => {
  await getCSRFToken()
  const response = await post<AuthResponse>('/login', credentials, {
    loadingMessage: 'Signing in...',
    showSuccessNotification: false // We'll handle this manually
  })
  
  // Store token and user data
  if (response.data.data?.token) {
    localStorage.setItem('auth_token', response.data.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  
  return response.data
}

// Register function
export const register = async (userData: RegisterData) => {
  await getCSRFToken()
  const response = await post<AuthResponse>('/register', userData, {
    loadingMessage: 'Creating account...',
    showSuccessNotification: false // We'll handle this manually
  })
  
  // Store token and user data
  if (response.data.data?.token) {
    localStorage.setItem('auth_token', response.data.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.data.user))
  }
  
  return response.data
}

// Logout function
export const logout = async () => {
  try {
    await post('/logout', {}, {
      loadingMessage: 'Signing out...',
      showSuccessNotification: false
    })
  } catch (error) {
    // Even if logout fails on server, clear local storage
    console.warn('Logout request failed, but clearing local storage')
  } finally {
    // Always clear local storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  }
}

// Get current user from server
export const getCurrentUser = async () => {
  const response = await get<User>('/user', {
    showLoading: false
  })
  return response.data
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token')
}

// Get stored user data
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {
      localStorage.removeItem('user')
      return null
    }
  }
  return null
}

// Clear auth data (for logout or token expiry)
export const clearAuthData = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
}