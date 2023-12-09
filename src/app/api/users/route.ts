import { User } from "@/app/types"
import supabase from "@/supabaseClient"

export const POST = async (request: Request) => {
  const { id, userType } = await request.json()
  try {
    const { data, error } = await supabase
      .from('users')
      .insert(
        { id, user_type: userType }
      ).select('*').single()


    return new Response(JSON.stringify(
      {
        userType: data?.user_type,
        id: data?.id,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at,
      }
    ), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}


