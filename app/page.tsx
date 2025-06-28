"use client"

import { Card } from "@/components/ui/card"
import { Database, TrendingUp, HandHeart, Info } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { UserMenu } from "@/components/user-menu"
import { AuthGuard } from "@/components/auth-guard"
import Image from 'next/image';

function HomeContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans relative">

      <div className="absolute top-4 right-4 z-20">
        <UserMenu />
      </div>

    
      <div className="relative h-[340px] w-full overflow-hidden">
        <img
          src="assets/background.svg"
          alt="Casa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Texto sobreposto à imagem */}
        <div className="absolute bottom-56 left-6 z-0 text-white">
          <h1 className="text-2xl font-bold leading-tight drop-shadow">
            Sistema de Estimativa de<br />Custo Residencial
          </h1>
        </div>

        {/* Data */}
        <div className="absolute bottom-4 left-6 text-white z-10">
          <p className="text-sm opacity-80">10 de Novembro 2024</p>
        </div>
      </div>

      {/* Cards sobrepostos à imagem */}
      <div className="relative -mt-16 z-30 px-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 justify-center">
          <Link href="/estimate">
            <Card className="w-[160px] h-[140px] p-5 bg-[#F5F5F5] rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Image width={60} height={60} src={'/assets/estimar.svg'} alt={'check'} />
                </div>
                <span className="text-sm font-semibold text-gray-800">Estimar</span>
              </div>
            </Card>
          </Link>

          <Link href="/compare">
            <Card className="w-[160px] h-[140px] p-5 bg-[#F5F5F5] rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 flex items-center justify-center">
                   <Image width={60} height={60} src={'/assets/comparar.svg'} alt={'check'} />
                </div>
                <span className="text-sm font-semibold text-gray-800">Comparar</span>
              </div>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 justify-center">
          <Link href="/contribute">
            <Card className="w-[160px] h-[140px] p-5 bg-[#F5F5F5] rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12  flex items-center justify-center">
                   <Image width={60} height={60} src={'/assets/contribuir.svg'} alt={'check'} />
                </div>
                <span className="text-sm font-semibold text-gray-800">Contribuir</span>
              </div>
            </Card>
          </Link>

          <Link href="/info">
            <Card className="w-[160px] h-[140px] p-5 bg-[#F5F5F5] rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition cursor-pointer">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                   <Image width={60} height={60} src={'/assets/verinfo.svg'} alt={'check'} />
                </div>
                <span className="text-sm font-semibold text-gray-800">Ver Info</span>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Versão e barra inferior */}
      <div className="text-center mt-16 mb-4">
        <p className="text-sm text-gray-400">Versão 1.0</p>
        <div className="flex justify-center mt-2">
          <div className="w-20 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  )
}
