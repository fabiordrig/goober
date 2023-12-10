
const API_KEY = process.env.NEXT_PUBLIC_GEOFINDER_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_GEOFINDER_API_URL;

export const getCities = async (address: string) => {


  const response = await fetch(
    `${API_URL}?q=${address}&apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data;
}
