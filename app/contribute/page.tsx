"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ContributePage() {
  const [formData, setFormData] = useState({
    houseType: "",
    year: "",
    floors: "",
    habitationType: "",
    coverageType: "",
    foundationType: "",
    wallType: "",
    area: "",
    precoTotal: "",
  })

  const handleContribute = async () => {
    await gerarPDF()
    alert("Dados contribuídos com sucesso! Obrigado por ajudar a melhorar o modelo.")
  }

  const gerarPDF = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.setTextColor(91, 33, 182) // roxo
    doc.text("Contribuição de Dados - Sistema de Estimativa", 20, 20)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)

    const linhas = [
      `📌 Tipo de Casa: ${formData.houseType}`,
      `📅 Ano: ${formData.year}`,
      `🏗️ Andares: ${formData.floors}`,
      `🏡 Tipo de Habitação: ${formData.habitationType}`,
      `🏠 Tipo de Cobertura: ${formData.coverageType}`,
      `🧱 Tipo de Fundação: ${formData.foundationType}`,
      `🧱 Tipo de Paredes: ${formData.wallType}`,
      `📐 Área: ${formData.area} m²`,
      `💰 Preço Total: ${formData.precoTotal} MZN`,
    ]

    linhas.forEach((linha, i) => {
      doc.text(linha, 20, 40 + i * 10)
    })

    doc.save("contribuicao-dados-casa.pdf")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <div className="flex items-center p-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="ml-4 text-lg font-semibold text-center flex items-center">Contribuição de Dados</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card className="p-4 bg-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Dados de casa</h2>
              <p className="text-sm opacity-90">Insira a baixo os seus dados da casa</p>
            </div>
            <CheckCircle className="w-6 h-6" />
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-sm font-medium">Tipo de casa</Label>
              <Select
                value={formData.houseType}
                onValueChange={(value) => setFormData({ ...formData, houseType: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="T3" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T3">T3</SelectItem>
                  <SelectItem value="T4">T4</SelectItem>
                  <SelectItem value="T5">T5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Ano</Label>
              <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="2030" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2030">2030</SelectItem>
                  <SelectItem value="2035">2035</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Andares</Label>
              <Select value={formData.floors} onValueChange={(value) => setFormData({ ...formData, floors: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Tipo de habitação</Label>
            <Select
              value={formData.habitationType}
              onValueChange={(value) => setFormData({ ...formData, habitationType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Casa convencional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="convencional">Casa convencional</SelectItem>
                <SelectItem value="moderna">Casa moderna</SelectItem>
                <SelectItem value="tradicional">Casa tradicional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Tipo de cobertura</Label>
            <Select
              value={formData.coverageType}
              onValueChange={(value) => setFormData({ ...formData, coverageType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chapa">Chapa</SelectItem>
                <SelectItem value="telha">Telha</SelectItem>
                <SelectItem value="laje">Laje</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Tipo de fundação</Label>
            <Select
              value={formData.foundationType}
              onValueChange={(value) => setFormData({ ...formData, foundationType: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Simples" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simples">Simples</SelectItem>
                <SelectItem value="profunda">Profunda</SelectItem>
                <SelectItem value="superficial">Superficial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Paredes</Label>
            <Select value={formData.wallType} onValueChange={(value) => setFormData({ ...formData, wallType: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Bloco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bloco">Bloco</SelectItem>
                <SelectItem value="tijolo">Tijolo</SelectItem>
                <SelectItem value="adobe">Adobe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Área (m2)</Label>
            <Input
              type="number"
              placeholder="500"
              className="mt-1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Preço Total (MZN)</Label>
            <Input
              type="number"
              placeholder="Ex: 1.200.000"
              className="mt-1"
              value={formData.precoTotal}
              onChange={(e) => setFormData({ ...formData, precoTotal: e.target.value })}
            />
          </div>
        </div>

        <Button
          onClick={handleContribute}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
        >
          Contribuir
        </Button>

        <div className="flex justify-center pt-4">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
