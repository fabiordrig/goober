import { Driver } from "@/app/types";
import supabase from "@/supabaseClient";

export const GET = async (req: Request, { params }: any) => {
  try {
    const { id } = params;


    const { data } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single()

    const response = {
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
      updatedAt: data?.updated_at,
    } as unknown as Driver



    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
