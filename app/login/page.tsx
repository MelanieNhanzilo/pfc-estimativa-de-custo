"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      if (formData.email === "admin@exemplo.com" && formData.password === "123456") {
        await login({
          id: "1",
          name: "Usuário Exemplo",
          email: formData.email,
          avatar: "",
        })
        router.push("/")
      } else {
        setErrors({ general: "Email ou senha incorretos" })
      }
    } catch (error) {
      setErrors({ general: "Erro ao fazer login. Tente novamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Top Image with Title */}
      <div className="relative w-full h-72">
        <img
          src="/assets/background.svg" 
          alt="Casa"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bottom-44 flex flex-col justify-end px-6 pb-4">
          <h1 className="text-white text-xl font-semibold leading-tight ">
            Login - Estimativa <br /> De Custo Residencial
          </h1>
        </div>
      </div>

      {/* Formulário de Login */}
      <div className="flex justify-center relative -mt-72 z-30 px-6 space-y-4">
        <Card className="w-full max-w-md p-6 z-10 bg-gray-100 shadow-2xl rounded-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <h2 className="text-center text-xl font-semibold text-gray-800">Login</h2>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="melanie@gmail.com"
                  className={`pl-10 py-3 rounded-xl text-sm ${errors.email ? "border-red-500" : ""}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700">Palavra passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  className={`pl-10 pr-10 py-3 rounded-xl text-sm ${errors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6B46C1] hover:bg-[#553C9A] text-white py-3 rounded-2xl text-base font-bold disabled:opacity-50"
            >
              {isLoading ? "Entrando..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Não possui conta?{" "}
            <Link href="/register" className="text-[#6B46C1] font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </Card>
      </div>

      {/* Versão */}
      <div className="text-center text-xs text-gray-400 my-4">
        Versão 1.0
      </div>
    </div>
  )
}
