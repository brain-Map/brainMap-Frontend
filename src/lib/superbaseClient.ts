import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session) {
    try {
        const user_role = localStorage.getItem("user_role")
      // Only update user role if it's not already set
      if (!session.user.user_metadata?.user_role) {
        await supabase.auth.updateUser({
          data: { user_role }
        })
      }
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }
})