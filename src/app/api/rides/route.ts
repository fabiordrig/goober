import { Ride } from "@/app/types"
import supabase from "@/supabaseClient"
import { getCityByLatAndLng } from "../geofinder"

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
    .update({ status: 'accepted', driver_id: driverId, accepted_at: new Date() })
    .match({ rider_id: riderId, status: 'pending' })
    .select("*").single();




  if (error || count === 0) {
    throw new Error(JSON.stringify({ message: "The ride is already taken" }));
  }

  const ride: Ride = {
    id: data.id,
    riderId: data.rider_id,
    status: data.status,
    driverId: data.driver_id,
    price: data.price,
    pickupLocationLat: data.pickup_location_lat,
    pickupLocationLng: data.pickup_location_lng,
    dropoffLocationLat: data.dropoff_location_lat,
    dropoffLocationLng: data.dropoff_location_lng,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    acceptedAt: data.accepted_at,
  }

  const pickupLocations = await getCityByLatAndLng(data.pickup_location_lat, data.pickup_location_lng);
  const dropoffLocations = await getCityByLatAndLng(data.dropoff_location_lat, data.dropoff_location_lng);

  return new Response(JSON.stringify({
    ...ride,
    pickupLocation: pickupLocations.items[0].title,
    dropoffLocation: dropoffLocations.items[0].title,
  }), { status: 200 });

}


export const POST = async (request: Request) => {
  try {
    const { riderId, pickup, dropoff, price } = await request.json()

    const { data: rides } = await supabase
      .from('rides')
      .select('*')
      .eq('rider_id', riderId)
      .eq('status', 'pending')

    if (!!rides?.length) {
      return new Response(JSON.stringify({ message: 'You already have a pending ride' }), { status: 422 })
    }



    const { data } = await supabase
      .from('rides')
      .insert([
        {
          rider_id: riderId, status: 'pending',
          price,
          pickup_location_lat: pickup.lat,
          pickup_location_lng: pickup.lng,
          dropoff_location_lat: dropoff.lat,
          dropoff_location_lng: dropoff.lng,
        }]
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
