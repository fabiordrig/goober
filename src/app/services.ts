import { Driver, GeofinderLocation, NewUser, Ride, User } from "./types";

export const getActiveRide = async (riderId: string, status?: string): Promise<Ride> => {
  const url = status ? `/api/rides/${riderId}?status=${status}` : `/api/rides/${riderId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result;
}

export const getDriver = async (id: string): Promise<Driver> => {
  const response = await fetch(`/api/drivers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  return result;
}



export const getETA = async (riderId: string): Promise<number> => {
  const response = await fetch(`/api/rides/${riderId}/eta`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  return result;
}


export const getUser = async (id: string): Promise<User> => {
  const response = await fetch(`/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  return result;
}


export const createUser = async (payload: NewUser): Promise<User> => {
  const response = await fetch(`/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });


  const result = await response.json();

  return result;
}

export const createDriver = async (payload: NewUser): Promise<Driver> => {
  const response = await fetch(`/api/drivers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};



export const getLocations = async (address: string): Promise<GeofinderLocation[]> => {

  if (!address) {
    throw new Error("Address is required")
  };
  const response = await fetch(`/api/geofinder?address=${address}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  const locations = result.items.map((item: any) => {
    return {
      address: item.title,
      lat: item.position.lat,
      lng: item.position.lng,
    }
  }
  );

  return locations;
}


export const calculateFare = async (pickup: GeofinderLocation, dropoff: GeofinderLocation): Promise<number> => {
  const response = await fetch(`/api/fare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pickup, dropoff }),
  });

  const result = await response.json();

  return result;
}


export const requestRide = async (riderId: string, pickup: GeofinderLocation, dropoff: GeofinderLocation, price: number): Promise<Ride> => {
  const response = await fetch(`/api/rides`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ riderId, pickup, dropoff, price }),
  });

  const result = await response.json();

  return result;

}
