"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ArrowLeft, Download, Share } from "lucide-react"
import Link from "next/link"
import * as ort from "onnxruntime-web"

const baseData = {
  quartos: "2",
  duracao: "6",
  pisos: "1",
  padraoCasa: "medio",
  tipoCasa: "0",
  fundacao: "simples",
  paredes: "bloco",
  area: "40",
}

export default function CompareCoberturaPage() {
  const [cobertura1, setCobertura1] = useState("chapa")
  const [cobertura2, setCobertura2] = useState("telha")
  const [results, setResults] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(false)

  const handleCompare = async () => {
    setLoading(true)
    const session = await ort.InferenceSession.create("/modelo_rf.onnx")
    const estimativas: { [key: string]: number } = {}

    for (const cobertura of [cobertura1, cobertura2]) {
      const inputArray = new Float32Array([
        parseInt(baseData.quartos),
        parseFloat(baseData.area),
        parseInt(baseData.pisos),
        cobertura === "chapa" ? 0 : cobertura === "telha" ? 1 : 2,
        baseData.fundacao === "simples" ? 0 : 1,
        parseInt(baseData.duracao),
        baseData.paredes === "bloco" ? 0 : 1,
        parseInt(baseData.tipoCasa),
        baseData.padraoCasa === "baixo" ? 3 : baseData.padraoCasa === "medio" ? 7 : 9,
      ])

      const tensor = new ort.Tensor("float32", inputArray, [1, 9])
      const output = await session.run({ input: tensor })
      estimativas[cobertura] = Number(output[session.outputNames[0]].data[0])
    }

    setResults(estimativas)
    setLoading(false)
  }

  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    const dif = results[cobertura2] - results[cobertura1]
    const percent = ((dif / results[cobertura1]) * 100).toFixed(1)

    doc.setFontSize(18)
    doc.setTextColor(128, 90, 213)
    doc.text("Relatório de Comparação de Coberturas", 20, 30)

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`${cobertura1.toUpperCase()}: ${results[cobertura1]?.toLocaleString()} MZN`, 20, 50)
    doc.text(`${cobertura2.toUpperCase()}: ${results[cobertura2]?.toLocaleString()} MZN`, 20, 60)
    doc.text(`Diferença: ${dif.toLocaleString()} MZN (${percent}%)`, 20, 80)

    doc.save("comparacao-coberturas.pdf")
  }

  const compartilhar = async () => {
    const dif = results[cobertura2] - results[cobertura1]
    const percent = ((dif / results[cobertura1]) * 100).toFixed(1)

    const texto = `🏠 COMPARAÇÃO DE COBERTURAS

📌 Base: T2 | 40m² | 1 Piso | Padrão Médio
🔩 ${cobertura1.toUpperCase()}: ${results[cobertura1]?.toLocaleString()} MZN
🔩 ${cobertura2.toUpperCase()}: ${results[cobertura2]?.toLocaleString()} MZN

💸 Diferença: ${dif.toLocaleString()} MZN (${percent}%)

Gerado por Sistema de Estimativa v1.0`

    if (navigator.share) {
      await navigator.share({ title: "Comparação de Cobertura", text: texto })
    } else {
      await navigator.clipboard.writeText(texto)
      alert("Texto copiado para partilha!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center p-4">
        <Link href="/">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="ml-4 text-lg font-semibold">Comparar Coberturas</h1>
      </div>

      <div className="p-4 space-y-6">
        <Card className="p-4 bg-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Comparação</h2>
              <p className="text-sm opacity-90">Seleccione dois tipos de cobertura</p>
            </div>
            <Share className="w-6 h-6" />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium mb-1">Cobertura 1</p>
            <Select value={cobertura1} onValueChange={setCobertura1}>
              <SelectTrigger>
                <SelectValue placeholder="Cobertura 1" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chapa">Chapa</SelectItem>
                <SelectItem value="telha">Telha</SelectItem>
                <SelectItem value="laje">Laje</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Cobertura 2</p>
            <Select value={cobertura2} onValueChange={setCobertura2}>
              <SelectTrigger>
                <SelectValue placeholder="Cobertura 2" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chapa">Chapa</SelectItem>
                <SelectItem value="telha">Telha</SelectItem>
                <SelectItem value="laje">Laje</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleCompare}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
        >
          Comparar
        </Button>

        {loading && (
          <div className="text-center text-purple-700 py-8 font-medium">🏗️ A calcular estimativas...</div>
        )}

        {!loading && results[cobertura1] && results[cobertura2] && (
          <Card className="p-6 space-y-4">
            <div className="text-center">
              <h2 className="font-semibold">{cobertura1.toUpperCase()}</h2>
              <p className="text-2xl font-bold text-purple-600">{results[cobertura1].toLocaleString()} MZN</p>
            </div>

            <div className="text-center">
              <h2 className="font-semibold">{cobertura2.toUpperCase()}</h2>
              <p className="text-2xl font-bold text-purple-600">{results[cobertura2].toLocaleString()} MZN</p>
            </div>

            <div className="text-center text-green-600 font-medium mt-4">
              Diferença: {(results[cobertura2] - results[cobertura1]).toLocaleString()} MZN (
              {((results[cobertura2] - results[cobertura1]) / results[cobertura1] * 100).toFixed(1)}%)
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="w-full" onClick={downloadPDF}>
                <Download className="w-4 h-4 mr-2" /> Baixar PDF
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={compartilhar}>
                <Share className="w-4 h-4 mr-2" /> Partilhar
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
