import { ReactNode } from 'react'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-red-700 text-white shadow-md p-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl hover:text-red-100 transition">
          DataGoal
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm">Área Privada</span>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
