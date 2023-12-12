import { Ride } from "@/app/types";
import supabase from "@/supabaseClient";

export const PATCH = async (req: Request, { params }: any) => {

  const { driverId } = await req.json();


  const { data, error, count } = await supabase
    .from('rides')
    .update({ status: 'completed' })
    .match({ rider_id: params.id, driver_id: driverId, status: 'accepted' })
    .select("*").single();



  if (error || count === 0) {
    throw new Error(JSON.stringify({ message: "Unable to complete the ride" }));
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
    startedAt: data.started_at,
    acceptedAt: data.accepted_at,
  }



  return new Response(JSON.stringify(ride), { status: 200 });

}
