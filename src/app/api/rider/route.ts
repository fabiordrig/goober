import supabase from "@/supabaseClient"



export const GET = async () => {
  try {
    const { data } = await supabase
      .from('notes')
      .select('*')

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
