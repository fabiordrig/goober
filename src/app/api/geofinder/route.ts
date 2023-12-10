
import { getCities } from "../geofinder"

export const GET = async (req: Request) => {
  try {

    const params = new URL(req.url).searchParams
    const address = params.get("address")

    if (!address) {
      throw new Error("Address is required")
    }

    const data = await getCities(address)

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 })
  }
}


