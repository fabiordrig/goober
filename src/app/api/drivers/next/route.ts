import { calculateDistance } from "@/app/api/utils";
import { GeofinderLocation, Ride } from "@/app/types";
import supabase from "@/supabaseClient";
import { getCityByLatAndLng } from "../../geofinder";

const findClosestRide = (rides: any[], driverLocation: GeofinderLocation) => {
  if (!rides.length) return null;
  return rides.reduce((nearestRide: any | null, currentRide) => {
    const currentDistance = calculateDistance(driverLocation.lat, driverLocation.lng, currentRide.pickup_location_lat, currentRide.pickup_location_lng);
    const nearestDistance = nearestRide ? calculateDistance(driverLocation.lat, driverLocation.lng, nearestRide.pickup_location_lat, nearestRide.pickup_location_lng) : Number.MAX_VALUE;

    return currentDistance < nearestDistance ? currentRide : nearestRide;
  }, null);
};

export const POST = async (req: Request) => {
  try {
    const { driverLocation, driverId } = await req.json();

    const { data: currentRide } = await supabase
      .from('rides')
      .select('*')
      .eq('driver_id', driverId)
      .eq('status', 'accepted')
      .single();

    if (currentRide) {
      const ride: Ride = {
        id: currentRide.id,
        riderId: currentRide.rider_id,
        status: currentRide.status,
        driverId: currentRide.driver_id,
        price: currentRide.price,
        pickupLocationLat: currentRide.pickup_location_lat,
        pickupLocationLng: currentRide.pickup_location_lng,
        dropoffLocationLat: currentRide.dropoff_location_lat,
        dropoffLocationLng: currentRide.dropoff_location_lng,
        createdAt: currentRide.created_at,
        updatedAt: currentRide.updated_at,
        startedAt: currentRide.started_at,
        acceptedAt: currentRide.accepted_at,
      }


      // const pickupLocations = await getCityByLatAndLng(currentRide.pickup_location_lat, currentRide.pickup_location_lng);
      // const dropoffLocations = await getCityByLatAndLng(currentRide.dropoff_location_lat, currentRide.dropoff_location_lng);


      return new Response(JSON.stringify({
        ...ride,
        pickupLocation: "Pickup",
        dropoffLocation: "Dropoff",
      }), { status: 200 });
    }


    const { data: rides } = await supabase
      .from('rides')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    const closestRide: any | null = findClosestRide(rides as Ride[], driverLocation);

    if (!closestRide) {
      return new Response(JSON.stringify({ message: 'No rides available' }), { status: 404 });
    }

    const ride: Ride = {
      id: closestRide.id,
      riderId: closestRide.rider_id,
      status: closestRide.status,
      driverId: closestRide.driver_id,
      price: closestRide.price,
      pickupLocationLat: closestRide.pickup_location_lat,
      pickupLocationLng: closestRide.pickup_location_lng,
      dropoffLocationLat: closestRide.dropoff_location_lat,
      dropoffLocationLng: closestRide.dropoff_location_lng,
      createdAt: closestRide.created_at,
      updatedAt: closestRide.updated_at,
      startedAt: closestRide.started_at,
      acceptedAt: closestRide.accepted_at,
    }

    const pickupLocations = await getCityByLatAndLng(closestRide.pickup_location_lat, closestRide.pickup_location_lng);
    const dropoffLocations = await getCityByLatAndLng(closestRide.dropoff_location_lat, closestRide.dropoff_location_lng);



    return new Response(JSON.stringify({
      ...ride,
      pickupLocation: pickupLocations.items[0].title,
      dropoffLocation: dropoffLocations.items[0].title,
    }), { status: 200 });
  } catch (error) {

    return new Response(JSON.stringify(error), { status: 500 });
  }
};
