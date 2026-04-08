'use server'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function crearUsuario(formData: FormData) {
  const email = formData.get('email')?.toString().trim()
  const password = formData.get('password')?.toString().trim()
  const rol = formData.get('rol')?.toString().trim()
  
  // Nuevos campos expandidos
  const nombre = formData.get('nombre')?.toString().trim()
  const apellido = formData.get('apellido')?.toString().trim()
  const telefono = formData.get('telefono')?.toString().trim()
  const fecha_nacimiento = formData.get('fecha_nacimiento')?.toString()
  const posicion = formData.get('posicion')?.toString()
  const categoria = formData.get('categoria')?.toString()

  if (!email || !password || !rol || !nombre || !apellido) {
    return {
      success: false,
      message: 'Nombre, Apellido, Email, Contraseña y Rol son obligatorios.',
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres.',
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return {
      success: false,
      message: 'Falta configuración del servidor (Service Role Key).',
    }
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

  // 1. Crear el usuario en Auth (Identidad)
  const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      rol,
      nombre,
      apellido
    }
  })

  if (authError || !newUser.user) {
    return {
      success: false,
      message: 'Error creando la identidad: ' + (authError?.message || 'Fallo desconocido'),
    }
  }

  // 2. Crear/Actualizar el perfil con TODOS los datos
  const { error: profileError } = await supabaseAdmin
    .from('perfiles')
    .upsert([
      {
        id: newUser.user.id,
        rol,
        email,
        nombre,
        apellido,
        telefono,
        fecha_nacimiento,
        posicion: (rol === 'jugador') ? posicion : null,
        categoria: (rol !== 'admin') ? categoria : null,
        estado: 'activo',
        actualizado_en: new Date().toISOString()
      }
    ])

  if (profileError) {
    console.error('Error al guardar perfil:', profileError)
  }

  revalidatePath('/dashboard/admin/usuarios')

  return {
    success: true,
    message: `Perfil de ${rol} creado exitosamente.`,
  }
}

export async function editarUsuario(formData: FormData) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, message: 'Falta configuración de administrador.' }
  }

  const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey)

  const id = formData.get('id')?.toString()
  const nombre = formData.get('nombre')?.toString().trim()
  const apellido = formData.get('apellido')?.toString().trim()
  const rol = formData.get('rol')?.toString().trim()

  if (!id || !rol) {
    return { success: false, message: 'ID y Rol son obligatorios.' }
  }

  const { error } = await supabaseAdmin
    .from('perfiles')
    .update({
      nombre: nombre || null,
      apellido: apellido || null,
      rol,
    })
    .eq('id', id)

  if (error) {
    console.error('Error editando perfil:', error)
    return { success: false, message: 'No se pudo actualizar el perfil.' }
  }

  revalidatePath('/dashboard/admin/usuarios')
  return { success: true, message: 'Perfil de usuario actualizado.' }
}
