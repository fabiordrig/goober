import { calculateETA } from "@/app/utils";
import supabase from "@/supabaseClient";

export const GET = async (req: Request, { params }: any) => {
  try {
    const { id } = params;

    const { data } = await supabase
      .from('rides')
      .select('*')
      .eq('id', id)
      .single()

    const eta = calculateETA(data?.pickup_location_lat, data?.pickup_location_lng, data?.dropoff_location_lat, data?.dropoff_location_lng);

    return new Response(JSON.stringify(eta), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
