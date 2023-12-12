
const API_KEY = process.env.NEXT_PUBLIC_GEOFINDER_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_GEOFINDER_API_URL;
const API_REVERSE_URL = process.env.NEXT_PUBLIC_GEOFINDER_REVERSE_API_URL;

export const getCities = async (address?: string) => {

  if (!address) {
    return;
  }

  const response = await fetch(
    `${API_URL}?q=${address}&apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data;
}

export const getCityByLatAndLng = async (lat: number, lng: number) => {
  const response = await fetch(
    `${API_REVERSE_URL}?at=${lat},${lng}&apiKey=${API_KEY}`
  );
  const data = await response.json();
  return data;
}
