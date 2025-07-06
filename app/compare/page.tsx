"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  const [cobertura1, setCobertura1] = useState("")
  const [cobertura2, setCobertura2] = useState("")
  const [tipoCasa, setTipoCasa] = useState("")
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
        parseInt(tipoCasa),
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

    const texto = `🏠 COMPARAÇÃO DE COBERTURAS\n\n📌 Base: T2 | 40m² | 1 Piso | Padrão Médio\n🔩 ${cobertura1.toUpperCase()}: ${results[cobertura1]?.toLocaleString()} MZN\n🔩 ${cobertura2.toUpperCase()}: ${results[cobertura2]?.toLocaleString()} MZN\n\n💸 Diferença: ${dif.toLocaleString()} MZN (${percent}%)\n\nGerado por Sistema de Estimativa v1.0`

    if (navigator.share) {
      await navigator.share({ title: "Comparação de Cobertura", text: texto })
    } else {
      await navigator.clipboard.writeText(texto)
      alert("Texto copiado para partilha!")
    }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <ArrowLeft className="w-5 h-5 text-black" />
        </Link>
        <h1 className="ml-4 text-base font-semibold">Comparar</h1>
      </div>

      <div className="space-y-4">
        <Select value={tipoCasa} onValueChange={setTipoCasa}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de casa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Tipo 1</SelectItem>
            <SelectItem value="1">Tipo 2</SelectItem>
            <SelectItem value="2">Tipo 3</SelectItem>
          </SelectContent>
        </Select>

        <Select value={cobertura1} onValueChange={setCobertura1}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de cobertura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chapa">Chapa</SelectItem>
            <SelectItem value="telha">Telha</SelectItem>
            <SelectItem value="laje">Laje</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex justify-center items-center py-2">
          <div className="w-10 h-10 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">VS</span>
          </div>
        </div>

        <Select value={cobertura2} onValueChange={setCobertura2}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de cobertura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chapa">Chapa</SelectItem>
            <SelectItem value="telha">Telha</SelectItem>
            <SelectItem value="laje">Laje</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleCompare}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold"
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
