"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function InfoPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const infoSections = [
    {
      title: "Fundação",
      icon: "🏗️",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      description: "A fundação é a base da casa, responsável por distribuir o peso da estrutura no solo que pode ser •	Superficial Profunda simples"

    },
    {
      title: "Área da casa",
      icon: "🏠",
      color: "bg-red-100",
      iconColor: "text-red-600",
      description: "A área da casa define o espaço total de construção, normalmente medida em metros quadrados.",
    },
    {
      title: "Paredes",
      icon: "🧱",
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      description: "As paredes determinam a divisão dos ambientes e contribuem para a estabilidade da estrutura que pode ser de madeira, bloco ou tijolo.",
    },
    {
      title: "Nº de pisos",
      icon: "🏢",
      color: "bg-pink-100",
      iconColor: "text-pink-600",
      description: "O número de pisos indica quantos andares a construção terá, impactando diretamente no custo e na fundação.",
    },
       {
      title: "Tipo de casa",
      icon: "🏢",
      color: "bg-purple-100",
      iconColor: "text-pink-600",
      description: "Refere-se a características estruturais, tipo de construção Alvenaria ",
    },
        {
      title: "padrao de casa",
      icon: "🏠",
      color: "bg-yellow-200",
      iconColor: "text-pink-600",
      description: "Refere-se a do tipo medio, baixo e Alto ",
    },
  ]

  const toggleSection = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-between items-center p-4 text-sm font-medium bg-white">
        <span></span>
      </div>

      {/* Header */}
      <div className="">
        <div className="flex items-center p-4">
          <Link href="/">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="ml-4 text-lg font-semibold">Ver Informações</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Parâmetros de Construção</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            A construção é um dos pilares do desenvolvimento humano, abrangendo desde pequenas estruturas até grandes
            infraestruturas que moldam o ambiente urbano.
          </p>
        </div>

        {/* Info Sections (Accordion) */}
        <div className="space-y-3">
          {infoSections.map((section, index) => (
            <Card
              key={index}
              className="p-4 bg-white shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => toggleSection(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${section.color} rounded-lg flex items-center justify-center mr-3`}>
                    <span className="text-lg">{section.icon}</span>
                  </div>
                  <span className="font-medium text-gray-800">{section.title}</span>
                </div>
                {expandedIndex === index ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
              {expandedIndex === index && (
                <div className="mt-3 text-sm text-gray-600">{section.description}</div>
              )}
            </Card>
          ))}
        </div>

        {/* Bottom Indicator */}
        <div className="flex justify-center pt-8">
          <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
