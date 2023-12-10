export interface User {
  id: string;
  user_type: 'rider' | 'driver';
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  user_id: string;
  license_number: string;
  status: 'active' | 'inactive';
  rating: number | null;
  created_at: string;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  vehicle_type: string;
  insurance_details: string;
}

export interface Ride {
  id: string;
  rider_id: string;
  driver_id: string;
  vehicle_id: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_time: string;
  dropoff_time: string;
  status: 'requested' | 'in progress' | 'completed' | 'cancelled';
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  ride_id: string;
  rider_rating: number | null;
  driver_rating: number | null;
  comments: string | null;
  created_at: string;
}


export interface NewUser {
  id: string;
  userType: 'rider' | 'driver';
}


export type GeofinderLocation = {
  address: string;
  lat: number;
  lng: number;
}


