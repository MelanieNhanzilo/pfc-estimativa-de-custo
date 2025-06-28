"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    else if (formData.name.trim().length < 2) newErrors.name = "Nome muito curto"

    if (!formData.email) newErrors.email = "Email é obrigatório"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"

    if (!formData.password) newErrors.password = "Senha é obrigatória"
    else if (formData.password.length < 6) newErrors.password = "Senha muito curta"

    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirme a senha"
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Senhas não coincidem"

    if (!formData.acceptTerms) newErrors.acceptTerms = "Você deve aceitar os termos"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    try {
      await new Promise((res) => setTimeout(res, 1500))
      await login({
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        avatar: "",
      })
      router.push("/")
    } catch {
      setErrors({ general: "Erro ao registrar. Tente novamente." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Top image + title */}
      <div className="relative w-full h-72">
        <img
          src="/assets/background.svg"
          alt="Registro"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bottom-44 flex flex-col justify-end px-6 pb-4">
          <h1 className="text-white text-xl font-semibold leading-tight">
            Criar Conta <br /> Estimativa Residencial
          </h1>
        </div>
      </div>

      {/* Formulário de Registro */}
      <div className="flex justify-center relative -mt-56 z-30 px-6">
        <Card className="w-full max-w-md p-6 bg-gray-100 shadow-2xl rounded-xl space-y-5">
          <form onSubmit={handleRegister} className="space-y-5">
            <h2 className="text-center text-xl font-semibold text-gray-800">Criar Conta</h2>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {errors.general}
              </div>
            )}

            {/* Nome */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className={`pl-10 py-3 rounded-xl text-sm ${errors.name ? "border-red-500" : ""}`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className={`pl-10 py-3 rounded-xl text-sm ${errors.email ? "border-red-500" : ""}`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  className={`pl-10 pr-10 py-3 rounded-xl text-sm ${errors.password ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita sua senha"
                  className={`pl-10 pr-10 py-3 rounded-xl text-sm ${errors.confirmPassword ? "border-red-500" : ""}`}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Termos */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                className={errors.acceptTerms ? "border-red-500" : ""}
              />
              <Label htmlFor="acceptTerms" className="text-sm text-gray-600">
                Aceito os <Link href="/terms" className="text-purple-600 hover:underline">Termos</Link> e a <Link href="/privacy" className="text-purple-600 hover:underline">Privacidade</Link>
              </Label>
            </div>
            {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms}</p>}

            {/* Botão */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6B46C1] hover:bg-[#553C9A] text-white py-3 rounded-2xl text-base font-bold disabled:opacity-50"
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <p className="text-center text-sm mt-4 text-gray-600">
            Já tem conta?{" "}
            <Link href="/login" className="text-[#6B46C1] font-medium hover:underline">
              Entrar
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
