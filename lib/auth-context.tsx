"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (user: User) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const storedToken = localStorage.getItem("authToken")

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        // Clear invalid data
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (userData: User) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Generate a simple token (in real app, this comes from server)
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("authToken", token)

      setUser(userData)
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Clear stored data
      localStorage.removeItem("user")
      localStorage.removeItem("authToken")
      localStorage.removeItem("estimationResult")

      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) throw new Error("No user logged in")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = { ...user, ...userData }

      // Update stored data
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setUser(updatedUser)
    } catch (error) {
      console.error("Update user error:", error)
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
