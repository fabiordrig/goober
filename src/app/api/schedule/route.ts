import supabase from "@/supabaseClient";

export const POST = async (request: Request) => {
  const { riderId, time, dayOfWeek, pickup, dropoff } = await request.json();


  const { data: schedule, error: scheduleError } = await supabase
    .from('scheduled_rides')
    .insert({
      rider_id: riderId,
      schedule_time: time,
      schedule_day_of_week: dayOfWeek,
      pickup_location: pickup.address,
      pickup_location_lat: pickup.lat,
      pickup_location_lng: pickup.lng,
      dropoff_location: dropoff.address,
      dropoff_location_lat: dropoff.lat,
      dropoff_location_lng: dropoff.lng,
    }).select('*').single();

  if (scheduleError) {
    throw new Error(JSON.stringify(scheduleError));
  }



  return new Response(JSON.stringify(schedule), { status: 200 });
}
