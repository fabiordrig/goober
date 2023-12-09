import supabase from "@/supabaseClient"


export const GET = async () => {
  try {
    const { data } = await supabase
      .from('rides')
      .select('*')

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}

export const POST = async (request: Request) => {
  try {

    console.log(request.body)
    const { data } = await supabase
      .from('rides')
      .insert(request.body)

    return new Response(JSON.stringify(data), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
