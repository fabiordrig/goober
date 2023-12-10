export interface User {
  id: string;
  userType: 'rider' | 'driver';
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  status: 'active' | 'inactive';
  rating: number | null;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  createdAt: string;
}


export interface Ride {
  id: string;
  riderId: string;
  driverId: string;
  pickupLocationLat: number;
  pickupLocationLng: number;
  dropoffLocationLat: number;
  dropoffLocationLng: number;
  pickupTime?: string;
  dropoffTime?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriverRide extends Ride {
  pickupLocation: string;
  dropoffLocation: string;
}

export interface Rating {
  id: string;
  rideId: string;
  riderRating?: number;
  driverRating: number;
  comments?: string;
  createdAt: string;
}


export interface NewUser {
  id: string;
  userType: 'rider' | 'driver';
}


export type GeofinderLocation = {
  address?: string;
  lat: number;
  lng: number;
}


export interface NewDriver {
  id: string;
  userType: 'driver';
  licenseNumber: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
}
