"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, Mail, Save } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"

function ProfileContent() {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateUser(formData)
      setMessage("Perfil atualizado com sucesso!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm font-medium bg-white">
        <span></span>
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black rounded-full"></div>
            <div className="w-1 h-3 bg-black/30 rounded-full"></div>
          </div>
          <div className="ml-2 text-xs"></div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="flex items-center p-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="ml-4 text-lg font-semibold">Perfil</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Avatar */}
        <Card className="p-6 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </Card>

        {/* Edit Form */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Editar Informações</h3>

          {message && (
            <div
              className={`p-3 rounded-lg mb-4 ${message.includes("sucesso") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        </Card>

        {/* Bottom Indicator */}
        <div className="flex justify-center pt-4">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  )
}
