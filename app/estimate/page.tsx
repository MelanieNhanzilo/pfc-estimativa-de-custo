"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as ort from "onnxruntime-web"

export default function EstimatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    quartos: "1",
    duracao: "6",
    pisos: "1",
    padraoCasa: "medio",
    cobertura: "chapa",
    tipoCasa: "0",
    fundacao: "simples",
    paredes: "bloco",
    area: "20",
  })

  const handleEstimate = async () => {
    setLoading(true)

    const prediction = await predictWithONNX(formData)
    localStorage.setItem("estimationResult", JSON.stringify(prediction))

    setTimeout(() => {
      router.push("/report")
    }, 4500)
  }

  const predictWithONNX = async (data: typeof formData) => {
    const session = await ort.InferenceSession.create("/modelo_rf.onnx")

    const inputArray = new Float32Array([
      parseInt(data.quartos), // quartos
      parseFloat(data.area),  // área
      parseInt(data.pisos),   // pisos
      data.cobertura === "chapa" ? 0 : data.cobertura === "telha" ? 1 : 1, // cobertura
      data.fundacao === "simples" ? 0 : data.fundacao === "profunda" ? 1 : 1, // fundação
      parseInt(data.duracao), // duração
      data.paredes === "bloco" ? 0 : data.paredes === "tijolo" ? 1 : 1, // paredes
      parseInt(data.tipoCasa), // tipo de casa
      data.padraoCasa === "baixo" ? 3 : data.padraoCasa === "medio" ? 7 : 9, // padrão
    ])

    const tensor = new ort.Tensor("float32", inputArray, [1, 9])
    const results = await session.run({ input: tensor })
    const output = results[session.outputNames[0]]

    const total = Number(output.data[0])
    return {
      total,
      breakdown: {
        fundacao: total * 0.30,
        paredes: total * 0.20,
        cobertura: total * 0.30,
        outros: total * 0.20,
      },
      range: {
        min: total * 0.9,
        max: total * 1.1,
      },
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100 text-center p-6 transition-all">
        <div className="text-7xl mb-4 animate-bounce">🏗️</div>
        <h2 className="text-xl font-bold text-purple-800 mb-2">A calcular a estimativa de custos...</h2>
        <p className="text-sm text-purple-700">Estamos a processar os dados inseridos.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center p-4">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="ml-4 text-lg font-semibold">Estimativa de custos</h1>
      </div>

      <div className="p-4 space-y-6">
        <Card className="p-4 bg-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Dados da casa</h2>
              <p className="text-sm opacity-90">Insira os dados da casa</p>
            </div>
            <CheckCircle className="w-6 h-6" />
          </div>
        </Card>

        <div className="space-y-4">
          <div className=" md:grid-cols-3 gap-3">
            <div>
              <Label>Qtd de quartos</Label>
              <Select
                value={formData.quartos}
                onValueChange={(value) => setFormData({ ...formData, quartos: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duração da obra</Label>
              <Select
                value={formData.duracao}
                onValueChange={(value) => setFormData({ ...formData, duracao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="6 meses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Número de pisos</Label>
              <Select
                value={formData.pisos}
                onValueChange={(value) => setFormData({ ...formData, pisos: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Padrão da casa</Label>
              <Select
                value={formData.padraoCasa}
                onValueChange={(value) => setFormData({ ...formData, padraoCasa: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Médio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixo">Baixo</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de cobertura</Label>
              <Select
                value={formData.cobertura}
                onValueChange={(value) => setFormData({ ...formData, cobertura: value })}
              >
                <SelectTrigger>
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
              <Label>Tipo de fundação</Label>
              <Select
                value={formData.fundacao}
                onValueChange={(value) => setFormData({ ...formData, fundacao: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Simples" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simples">Simples</SelectItem>
                  <SelectItem value="profunda">Profunda</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Paredes</Label>
              <Select
                value={formData.paredes}
                onValueChange={(value) => setFormData({ ...formData, paredes: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bloco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bloco">Bloco</SelectItem>
                  <SelectItem value="tijolo">Tijolo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Área (m²)</Label>
              <Input
                type="number"
                placeholder="20"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleEstimate}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
        >
          Estimar
        </Button>
      </div>
    </div>
  )
}
