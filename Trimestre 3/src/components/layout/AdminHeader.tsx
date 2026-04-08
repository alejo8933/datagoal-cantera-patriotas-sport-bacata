'use client'

import { Settings, Bell, Search, LogOut } from 'lucide-react'
import Link from 'next/link'

interface AdminHeaderProps {
  nombre: string
  apellido: string
  rol: string
}

export default function AdminHeader({ nombre, apellido, rol }: AdminHeaderProps) {
  const initial = nombre ? nombre.charAt(0).toUpperCase() : 'A'
  const char = apellido ? apellido.charAt(0).toUpperCase() : ''

  return (
    <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-0 z-50 px-8 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-6">
        {/* LOGO AREA (OPCIONAL/MANTENIDO) */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">Dashboard</h2>
            <h1 className="text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
              Administración
              <span className="h-1 w-1 rounded-full bg-red-600"></span>
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* BUSCADOR PREMIUM */}
        <div className="relative group hidden lg:block">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
            <Search size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Buscar en DataGoal..." 
            className="pl-11 pr-12 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold focus:ring-4 focus:ring-red-500/5 focus:border-red-500/20 focus:bg-white outline-none w-72 transition-all shadow-sm group-hover:bg-gray-100 group-focus-within:w-80"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-focus-within:flex items-center gap-1">
             <span className="text-[10px] font-black text-gray-400 px-1.5 py-0.5 border border-gray-200 rounded-md bg-white">ESC</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* NOTIFICACIONES */}
          <button className="p-2.5 text-gray-400 hover:text-red-600 transition-all rounded-xl hover:bg-red-50 relative group">
            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20"></span>
          </button>
          
          {/* AJUSTES */}
          <Link 
            href="/dashboard/admin/perfil?tab=preferencias"
            className="p-2.5 text-gray-400 hover:text-gray-900 transition-all rounded-xl hover:bg-gray-100 group"
          >
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          </Link>

          {/* SEPARADOR */}
          <div className="h-8 w-px bg-gray-100 mx-2"></div>

          {/* PERFIL PREMIUM */}
          <Link 
            href="/dashboard/admin/perfil" 
            className="flex items-center gap-4 pl-2 py-1.5 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 pr-3 group select-none"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-gray-900 leading-none group-hover:text-red-600 transition-colors">
                {nombre} {apellido}
              </span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5 px-2 py-0.5 bg-gray-100 rounded-md group-hover:bg-red-50 group-hover:text-red-600 transition-colors">
                {rol || 'ADMIN'}
              </span>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 flex items-center justify-center text-white font-black shadow-lg shadow-red-500/20 transition-all group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-red-500/40 relative overflow-hidden">
               <span className="relative z-10 text-sm">{initial}{char}</span>
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
