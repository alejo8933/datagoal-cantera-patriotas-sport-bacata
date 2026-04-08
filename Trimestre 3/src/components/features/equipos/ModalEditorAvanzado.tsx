'use client'

import { useState, useRef } from 'react'
import { Edit3, X, Loader2, Image, Trophy, Medal, MapPin, User, Settings2, Calendar } from 'lucide-react'
import { editarEquipo } from '@/services/actions/equipos'

interface Equipo {
  id: string
  equipo: string
  categoria: string
  imagen_url?: string
  fundacion?: number
  sede?: string
  tecnico?: string
  logros?: any
}

export default function ModalEditorAvanzado({ equipo }: { equipo: Equipo }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Parsear logros para el textarea (cada línea un logro)
  const logrosTexto = Array.isArray(equipo.logros) 
    ? equipo.logros.join('\n') 
    : (typeof equipo.logros === 'string' ? JSON.parse(equipo.logros).join('\n') : '')

  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', equipo.id)
    
    const result = await editarEquipo(formData)
    
    if (result?.success) {
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error al actualizar.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-gray-600 font-bold rounded-xl border border-gray-100 hover:bg-gray-50 transition-all text-[10px] uppercase tracking-widest hover:border-red-100 hover:text-red-600"
      >
        <Edit3 size={14} />
        Editar Perfil
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-gray-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            
            {/* MODAL HEADER */}
            <div className="p-10 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-red-600 text-white rounded-[1.5rem] shadow-xl shadow-red-500/20">
                  <Settings2 size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-950 tracking-tight">
                    Configuración de Equipo
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mt-0.5">
                    Modificando el perfil oficial de <span className="text-red-600 font-bold">{equipo.equipo}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => !isLoading && setIsOpen(false)} 
                className="p-3 bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full shadow-sm transition-all border border-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-10 md:p-14 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {error && (
                <div className="mb-10 p-5 bg-red-50 text-red-700 text-sm rounded-[1.5rem] border-l-8 border-red-500 font-bold flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                
                {/* IDENTIDAD VISUAL */}
                <div className="space-y-4 md:col-span-2 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                    <Image size={16} className="text-red-500" />
                    Imagen de Portada (URL Directa)
                  </div>
                  <input 
                    name="imagen_url" 
                    defaultValue={equipo.imagen_url || ''} 
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all font-medium text-gray-900 text-sm"
                  />
                  <p className="text-[10px] text-gray-400 italic ml-2">Recomendado: 1200x600px para mejor resolución.</p>
                </div>

                {/* DATOS BÁSICOS */}
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre de la Categoría</label>
                    <input 
                      name="equipo" 
                      defaultValue={equipo.equipo} 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500/30 rounded-2xl focus:bg-white transition-all font-bold text-gray-900 shadow-sm" 
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nivel Competitivo</label>
                    <select 
                      name="categoria" 
                      defaultValue={equipo.categoria} 
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500/30 rounded-2xl focus:bg-white transition-all font-bold text-gray-700 shadow-sm"
                    >
                      <option value="Sub-17">Sub-17 (Juvenil)</option>
                      <option value="Sub-15">Sub-15 (Cadete)</option>
                      <option value="Sub-13">Sub-13 (Infantil)</option>
                      <option value="Sub-10">Sub-10 (Benjamín)</option>
                    </select>
                  </div>
                </div>

                {/* DATOS DE GESTIÓN */}
                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <User size={14} className="text-blue-500" /> Director Técnico Encargado
                    </label>
                    <input 
                      name="tecnico" 
                      defaultValue={equipo.tecnico || ''} 
                      placeholder="Nombre del entrenador"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-blue-500/30 rounded-2xl focus:bg-white transition-all font-bold text-gray-900 shadow-sm" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <MapPin size={14} className="text-emerald-500" /> Sede Principal
                      </label>
                      <input 
                        name="sede" 
                        defaultValue={equipo.sede || ''} 
                        placeholder="Ej. Sede Norte"
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/30 rounded-2xl focus:bg-white transition-all font-bold text-gray-900 shadow-sm" 
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-500" /> Año Fundación
                      </label>
                      <input 
                        name="fundacion" 
                        type="number"
                        defaultValue={equipo.fundacion || 2013} 
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-500/30 rounded-2xl focus:bg-white transition-all font-bold text-gray-900 shadow-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* LOGROS Y PALMARÉS */}
                <div className="md:col-span-2 space-y-4 mt-4">
                  <div className="flex items-center gap-3 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                      <Trophy size={16} />
                    </div>
                    Palmarés del Equipo (Listado Histórico)
                  </div>
                  <div className="relative group">
                    <textarea 
                      name="logros_raw" 
                      defaultValue={logrosTexto}
                      rows={5}
                      placeholder="Escribe cada logro en una línea distinta..."
                      className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] focus:bg-white focus:border-yellow-400/50 transition-all font-medium text-gray-800 text-sm custom-scrollbar leading-relaxed"
                    />
                    <div className="absolute top-4 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Medal className="text-yellow-600" size={32} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 rounded-2xl border border-amber-100">
                    <div className="p-1 px-2 bg-amber-500 text-white text-[9px] font-black rounded-md uppercase">Tip</div>
                    <p className="text-[11px] text-amber-700 font-bold italic">
                      Cada línea que escribas aparecerá automáticamente con un icono de trofeo en la tarjeta principal.
                    </p>
                  </div>
                </div>

              </div>

              {/* ACCIONES FINALES */}
              <div className="mt-16 flex flex-col-reverse md:flex-row justify-end gap-6 pt-10 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)} 
                  className="px-10 py-5 text-gray-400 font-bold hover:text-gray-900 rounded-3xl transition-all text-xs uppercase tracking-[0.2em] hover:bg-gray-50"
                >
                  Cancelar Cambios
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-14 py-5 bg-gray-950 text-white font-black rounded-3xl hover:bg-black shadow-2xl shadow-gray-950/20 transition-all active:scale-95 disabled:opacity-50 text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={20} /> Actualizando Registro...</>
                  ) : 'Confirmar Cambios Master'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
