import supabase from "@/supabaseClient"

export const GET = async (_: Request, { params }: any) => {
  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', params.id)

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
