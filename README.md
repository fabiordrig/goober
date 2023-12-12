# Goober - Ride Sharing App

## Overview

Goober is a ride-sharing application that offers scheduled and immediate taxi rides.

## Implemented Features

### For Riders

- **Ride Scheduling**: Users can schedule rides for specific days of the week.
- **Requesting Rides**: Riders can request new rides, specifying pickup and dropoff locations.
- **ETA Viewing**: Riders can view the estimated time of arrival for their rides.

### For Drivers

- **Ride Cancellation**: Drivers can cancel rides that have already started.
- **Location-Based Ride Selection**: Automatically assigns the nearest ride based on the driver's current location.
- **Start and End Rides**: Drivers can initiate and complete rides within the app.

## Challenges faced

- **Ride Scheduling**: The challenge of implementing ride scheduling involved balancing user preferences and intricate date/time handling within the app's existing framework. Overcoming these challenges was rewarding as it greatly enhanced user experience by allowing advanced ride planning.
- **Location-Based Ride Selection for Drivers**: Crafting an algorithm for location-based ride assignment required complex geospatial calculations and real-time data handling. This development significantly boosted the app's operational efficiency and convenience for drivers and riders alike..
- **Learning Next.js**: This is the first time in my life working with this tool, so i'm proud with this result.

## Future Enhancements

- Implement a payment system.
- Add a feature for rating drivers and riders.
- Develop real-time ride tracking.

## Thoughts and Reflections

- I'm proud of the result, but the code is not clean enough, I need to refactor it. this is my first time using Next, to I discovered a lot of stuff during the development, but I follow the philosophy of "Make it work, make it right, make it fast". So for the first version, it works fine.
But if we have to scale this app, we need to refactor the code

## Time Spent

- According my wakatime, I spent 23 hours on this project.
- But we could break in:
- 8 hours to learn Next.js
- 3 hours to design the database
- 3 hours to design the UI
- 9 hours to code the app

## Installation and Setup

1. Clone the repository.
2. Add a `.env` file in the root directory with the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://dmvddyycapndsystezme.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=key
NEXT_PUBLIC_GEOFINDER_API_KEY=key
NEXT_PUBLIC_GEOFINDER_API_URL=https://geocode.search.hereapi.com/v1/geocode
NEXT_PUBLIC_GEOFINDER_REVERSE_API_URL=https://revgeocode.search.hereapi.com/v1/revgeocode
```

3. Create a new Supabase project and add the following tables:

```

CREATE EXTENSION IF NOT EXISTS "pgcrypto";



CREATE TABLE Users (
    id UUID PRIMARY KEY,
    user_type VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_type ON Users(user_type);
CREATE INDEX idx_users_created_at ON Users(created_at);

CREATE TABLE Drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES Users(id),
    license_number VARCHAR(255),
    status VARCHAR(255),
    rating FLOAT,
    make VARCHAR(255),
    model VARCHAR(255),
    year INT,
    license_plate VARCHAR(255) UNIQUE,
    color VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_drivers_user_id ON Drivers(user_id);
CREATE INDEX idx_drivers_status ON Drivers(status);
CREATE INDEX idx_drivers_rating ON Drivers(rating);


CREATE TABLE Rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rider_id UUID REFERENCES Users(id),
    driver_id UUID REFERENCES Drivers(id),
    pickup_location TEXT,
    pickup_location_lat float,
    pickup_location_lng float,
    dropoff_location TEXT,
    dropoff_location_lat float,
    dropoff_location_lng float,
    status VARCHAR(255),
    price FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE

);
CREATE INDEX idx_rides_rider_id ON Rides(rider_id);
CREATE INDEX idx_rides_driver_id ON Rides(driver_id);
CREATE INDEX idx_rides_status ON Rides(status);




CREATE TABLE scheduled_rides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid() ,
    rider_id uuid REFERENCES users(id),
    pickup_location TEXT,
    pickup_location_lat float,
    pickup_location_lng float,
    dropoff_location TEXT,
    dropoff_location_lat float,
    dropoff_location_lng float,
    schedule_day_of_week VARCHAR(10),
    schedule_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


``````

3. Create an account on [Here](https://developer.here.com/) and get an API key.
4. Run `npm install` to install dependencies.
5. Start the application with `npm run dev`.
6. Navigate to `localhost:3000` in your browser.

## Tips

- We are storing the userId and driverId on the localStorage, if you want to start from beginning, please clear the localStorage.
- To run the API to check the scheduled rides, please request for the route GET /api/cron
- The HERE api key is limited, so if you get an error, please change the key on the .env file.

## Video

- You can check the demo video here:
- [Video](https://youtu.be/FWL5tqWykxE)

## Production Version

- You can check the production version here:

- [Production Version Rider Page](https://trashlab-5mjh.vercel.app/)
- [Production Version Driver Page](https://trashlab-5mjh.vercel.app/driver)
