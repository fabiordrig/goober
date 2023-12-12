import { Driver } from "@/app/types"
import supabase from "@/supabaseClient"

export const POST = async (request: Request) => {
  const { id, userType,
    licenseNumber,
    make,
    model,
    year,
    licensePlate,
    color,
  } = await request.json()
  try {
    await supabase
      .from('users')
      .insert(
        { id, user_type: userType }
      ).select('*').single()


    const { data } = await supabase
      .from('drivers')
      .insert(
        { id, user_id: id, license_number: licenseNumber, status: "active", make, model, year, license_plate: licensePlate, color }
      ).select('*').single()

    const response: Driver = {
      id: data?.id,
      userId: data?.user_id,
      licenseNumber: data?.license_number,
      status: data?.status,
      rating: data?.rating,
      make: data?.make,
      model: data?.model,
      year: data?.year,
      licensePlate: data?.license_plate,
      color: data?.color,
      createdAt: data?.created_at,
    }

    return new Response(JSON.stringify(
      response
    ), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}


