import { Ride } from "@/app/types"
import supabase from "@/supabaseClient"


export const GET = async (req: Request, { params }: any) => {
  try {



    const { data } = await supabase
      .from('rides')
      .select('*')
      .eq('rider_id', params.id)
      .or(`status.eq.pending,status.eq.accepted`)
      .order('created_at', { ascending: false })
      .single()



    if (!data) {
      throw new Error(JSON.stringify({ message: "No ride found" }))
    }



    const response = {
      id: data?.id,
      riderId: data?.rider_id,
      status: data?.status,
      driverId: data?.driver_id,
      price: data?.price,
      pickupLocationLat: data?.pickup_location_lat,
      pickupLocationLng: data?.pickup_location_lng,
      dropoffLocationLat: data?.dropoff_location_lat,
      dropoffLocationLng: data?.dropoff_location_lng,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at,
    } as unknown as Ride

    return new Response(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}


export const DELETE = async (req: Request, { params }: any) => {
  try {
    const { data } = await supabase
      .from('rides')
      .update({ status: 'cancelled' })
      .eq('id', params.id)
      .single()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {

    return new Response(JSON.stringify(error), { status: 500 })
  }
}
