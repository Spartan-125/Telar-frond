export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "user"
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock authentication - replace with real auth service
export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock validation
  if (email && password.length >= 6) {
    return {
      id: "1",
      email,
      name: email.split("@")[0],
      role: "admin",
    }
  }

  throw new Error("Invalid credentials")
}

export const logoutUser = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" }
  }
  return { valid: true }
}
