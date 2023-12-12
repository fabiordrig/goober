import supabase from '@/supabaseClient';
import { calculateFare } from '../utils';


export const GET = async (_: Request) => {
  try {
    const today = new Date();
    const todayDayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });


    const { data: schedules, error: schedulesError } = await supabase
      .from('scheduled_rides')
      .select('*')
      .eq('schedule_day_of_week', todayDayOfWeek)
      .lte('schedule_time', today.toTimeString().slice(0, 5))
      .order('schedule_time', { ascending: true });



    if (schedulesError || !schedules.length) {
      return new Response(JSON.stringify({ message: "Failed to get schedules" }), { status: 404 });
    }


    const { data: pendingRides, error: pendingRidesError } = await supabase
      .from('rides')
      .select('*')
      .eq('status', 'pending');

    if (pendingRidesError) {
      return new Response(JSON.stringify({ message: "Failed to get pending reviews" }), { status: 404 });
    }

    const pendingRidesMap = new Map(pendingRides.map(ride => [ride.rider_id, ride]));

    for (const nextSchedule of schedules) {
      if (!pendingRidesMap.has(nextSchedule.rider_id)) {
        const price = calculateFare(nextSchedule.pickup_location_lat, nextSchedule.pickup_location_lng, nextSchedule.dropoff_location_lat, nextSchedule.dropoff_location_lng);

        const { error: rideError } = await supabase
          .from('rides')
          .insert({
            rider_id: nextSchedule.rider_id,
            status: 'pending',
            price,
            pickup_location_lat: nextSchedule.pickup_location_lat,
            pickup_location_lng: nextSchedule.pickup_location_lng,
            dropoff_location_lat: nextSchedule.dropoff_location_lat,
            dropoff_location_lng: nextSchedule.dropoff_location_lng,
          });

        if (rideError) {
          throw new Error('Failed to create ride from schedule');
        }
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
