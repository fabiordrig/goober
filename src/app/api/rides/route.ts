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


export const PATCH = async (req: Request) => {
  const { driverId, riderId } = await req.json();

  const { data, error, count } = await supabase
    .from('rides')
    .update({ status: 'accepted', driver_id: driverId })
    .match({ id: riderId, status: 'pending' })

  if (error || count === 0) {
    return new Response(JSON.stringify({ message: "The ride is already taken" }), { status: 422 });
  }

  return new Response(JSON.stringify(data), { status: 200 });

}


export const POST = async (request: Request) => {
  try {
    const { riderId, pickup, dropoff, price } = await request.json()

    const { data: rides } = await supabase
      .from('rides')
      .select('*')
      .eq('rider_id', riderId)
      .eq('status', 'pending')

    if (rides) {
      return new Response(JSON.stringify({ message: 'You already have a pending ride' }), { status: 422 })
    }



    const { data } = await supabase
      .from('rides')
      .insert(
        {
          rider_id: riderId, status: 'pending',
          price,
          pickup_location_lat: pickup.lat,
          pickup_location_lng: pickup.lng,
          dropoff_location_lat: dropoff.lat,
          dropoff_location_lng: dropoff.lng,
        }
      ).select('*').single()


    return new Response(JSON.stringify({
      id: data?.id,
      riderId: data?.rider_id,
      status: data?.status,
      createdAt: data?.created_at,
      updatedAt: data?.updated_at,
    }), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
