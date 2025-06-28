"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Download, Share } from "lucide-react"
import Link from "next/link"

interface EstimationResult {
  total: number
  breakdown: {
    foundation: number
    walls: number
    coverage: number
    finishes: number
  }
  range: {
    min: number
    max: number
  }
}

export default function ReportPage() {
  const [result, setResult] = useState<EstimationResult | null>(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

 useEffect(() => {
  const stored = localStorage.getItem("estimationResult")
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const total = Number(parsed.total) || 0

      // Recalcular as porcentagens corretamente
      const percentual_fundacao = 0.30
      const percentual_paredes = 0.20
      const percentual_cobertura = 0.30
      const percentual_outros = 0.20

      const safeResult: EstimationResult = {
        total: total,
        range: {
          min: total * 0.9,
          max: total * 1.1,
        },
        breakdown: {
          foundation: total * percentual_fundacao,
          walls: total * percentual_paredes,
          coverage: total * percentual_cobertura,
          finishes: total * percentual_outros,
        },
      }

      setResult(safeResult)
    } catch (error) {
      console.error("Erro ao carregar dados do localStorage:", error)
    }
  }
}, [])


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-MZ", {
      style: "currency",
      currency: "MZN",
      minimumFractionDigits: 0,
    }).format(value)
  }


const safeDisplay = (value: number | null | undefined) => {
  if (value === null || value === undefined || isNaN(value)) return "N/D"
  if (value === 0) return "0 MZN"
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M MZN`
  return `${Math.round(value / 1000)}K MZN`
}
  

  const generatePDF = async () => {
    if (!result) return

    setIsGeneratingPDF(true)

    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()

      doc.setFont("helvetica")
      doc.setFontSize(20)
      doc.setTextColor(128, 90, 213)
      doc.text("Relatório de Estimativa", 20, 30)
      doc.text("de Custo Residencial", 20, 45)

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 20, 55)

      doc.setFontSize(16)
      doc.setTextColor(0, 0, 0)
      doc.text("Custo Total", 20, 75)

      doc.setFontSize(24)
      doc.setTextColor(128, 90, 213)
      doc.text(`${formatCurrency(result.total)}`, 20, 90)

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text("Faixa de Valores:", 20, 105)
      doc.text(`Mínimo: ${safeDisplay(result.range.min)}`, 20, 115)
      doc.text(`Máximo: ${safeDisplay(result.range.max)}`, 20, 125)

      doc.setFontSize(16)
      doc.text("Detalhamento dos Custos", 20, 145)

      const breakdownItems = [
        { name: "Fundação", value: result.breakdown.foundation },
        { name: "Levantamento de Paredes", value: result.breakdown.walls },
        { name: "Cobertura", value: result.breakdown.coverage },
        { name: "Acabamentos", value: result.breakdown.finishes },
      ]

      let yPosition = 160
      doc.setFontSize(12)
      breakdownItems.forEach((item) => {
        doc.text(`${item.name}:`, 20, yPosition)
        doc.text(safeDisplay(item.value), 120, yPosition)
        yPosition += 15
      })

      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)


      doc.save(`estimativa-custo-${new Date().toISOString().split("T")[0]}.pdf`)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = async () => {
    if (!result) return

    setIsSharing(true)

    try {
      const shareData = {
        title: "Estimativa de Custo Residencial",
        text: `Custo Total Estimado: ${formatCurrency(result.total)}\n\nDetalhamento:\n• Fundação: ${safeDisplay(result.breakdown.foundation)}\n• Paredes: ${safeDisplay(result.breakdown.walls)}\n• Cobertura: ${safeDisplay(result.breakdown.coverage)}\n• Acabamentos: ${safeDisplay(result.breakdown.finishes)}`,
        url: window.location.href,
      }

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        const textToShare = `Estimativa de Custo Residencial\n\nCusto Total: ${formatCurrency(result.total)}\n\nDetalhamento:\n• Fundação: ${safeDisplay(result.breakdown.foundation)}\n• Paredes: ${safeDisplay(result.breakdown.walls)}\n• Cobertura: ${safeDisplay(result.breakdown.coverage)}\n• Acabamentos: ${safeDisplay(result.breakdown.finishes)}\n\nGerado pelo Sistema de Estimativa de Custo Residencial`
        await navigator.clipboard.writeText(textToShare)
        alert("Relatório copiado para a área de transferência!")
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
      alert("Erro ao compartilhar os dados. Verifique a compatibilidade do seu navegador.")
    } finally {
      setIsSharing(false)
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando relatório...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar */}
      <div className="flex justify-between items-center p-4 text-sm font-medium bg-white">
        <div className="flex items-center gap-1">
         
        </div>
      </div>

      {/* Header */}
      <div className="bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link href="/estimate">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="ml-4 text-lg font-semibold">Relatório</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Total Card */}
   <Card
  className="relative p-6 border-0 shadow-lg bg-cover bg-center text-black flex flex-col items-center justify-center text-center"
  style={{ backgroundImage: "url('/assets/back.png')" }}
>
  {/* Overlay escuro para melhor contraste */}
  <div className="absolute inset-0  rounded-xl z-0" />

  {/* Conteúdo */}
  <div className="relative z-10 w-full">
    <p className="text-sm mb-2">Custo Total</p>
    <h2 className="text-4xl font-bold mb-1">{formatCurrency(result.total)}</h2>
    <p className="text-lg mb-6">Meticais</p>

    <div>
      <div className="flex justify-between text-sm mb-2 w-full max-w-xs mx-auto">
        <span>Min</span>
        <span>Max</span>
      </div>
      <div className="flex justify-between font-semibold mb-2 w-full max-w-xs mx-auto">
        <span>{safeDisplay(result.range.min)}</span>
        <span>{safeDisplay(result.range.max)}</span>
      </div>
      <div className="w-full max-w-xs bg-white/40 rounded-full h-2 mx-auto">
        <div className="bg-purple-400 h-2 rounded-full" style={{ width: "60%" }}></div>
      </div>
    </div>
  </div>
</Card>

        {/* Breakdown */}
        <div className="space-y-3">
          {[
            { label: "Fundação", color: "blue", value: result.breakdown.foundation },
            { label: "Levant. Paredes", color: "orange", value: result.breakdown.walls },
            { label: "Cobertura", color: "teal", value: result.breakdown.coverage },
            { label: "Acabamentos", color: "yellow", value: result.breakdown.finishes },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                  <div className={`w-4 h-4 bg-${item.color}-600 rounded-sm`}></div>
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="font-semibold">{safeDisplay(item.value)}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1 py-3" onClick={generatePDF} disabled={isGeneratingPDF}>
            <Download className="w-4 h-4 mr-2" />
            {isGeneratingPDF ? "Gerando..." : "Baixar PDF"}
          </Button>
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700 py-3" onClick={handleShare} disabled={isSharing}>
            <Share className="w-4 h-4 mr-2" />
            {isSharing ? "Compartilhando..." : "Compartilhar"}
          </Button>
        </div>

        <div className="flex justify-center pt-4">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
