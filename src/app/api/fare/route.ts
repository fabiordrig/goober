import { calculateFare } from "@/app/utils"


export const POST = async (req: Request) => {
  try {
    const { pickup, dropoff } = await req.json()

    const fee = calculateFare(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng)


    return new Response(JSON.stringify(fee), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}
