import { getCityByLatAndLng } from "../../geofinder"



export const GET = async (req: Request) => {
  try {

    const params = new URL(req.url).searchParams
    const lat = params.get("lat")
    const lng = params.get("lng")

    if (!lat || !lng) {
      throw new Error("Lat and long is required")
    }

    const data = await getCityByLatAndLng(Number(lat), Number(lng))

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}


