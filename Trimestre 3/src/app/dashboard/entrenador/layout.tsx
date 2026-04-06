import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReactNode } from 'react'

export default async function EntrenadorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!perfil) {
    redirect('/login')
  }

  if (perfil.rol !== 'entrenador') {
    redirect(`/dashboard/${perfil.rol}`)
  }

  // Si pasa todo, le mostramos el subárbol
  return <>{children}</>
}
