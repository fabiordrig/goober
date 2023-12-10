"use client";

import React, { createContext, useContext, useState } from "react";
import { Driver, NewDriver, Ride, User } from "./types";
import { createDriver, getActiveRide, getUser } from "./services";

interface ContextProps {
  user?: User;
  setUser: (user: User) => void;
  activeRide?: Ride;
  setActiveRide: (ride?: Ride) => void;
  getUser: () => Promise<User>;
  getActiveRide: (rideId: string) => Promise<Ride>;
  driver?: Driver;
  setDriver: (driver: Driver) => void;
  createDriver: (driver: NewDriver) => void;
}

export const Context = createContext<ContextProps>({
  setActiveRide: () => {},
  setUser: () => {},
  getUser: () => Promise.reject(),
  getActiveRide: () => Promise.reject(),
  setDriver: () => {},
  createDriver: () => {},
});

export const useRideContext = () => useContext(Context);

interface RideContextProviderProps {
  children: React.ReactNode;
}

export const ContextProvider: React.FC<RideContextProviderProps> = ({ children }) => {
  const [activeRide, setActiveRide] = useState<Ride>();
  const [user, setUser] = useState<User>();
  const [driver, setDriver] = useState<Driver>();

  const handleGetUser = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      throw new Error("No user id found");
    }
    const user = await getUser(userId);
    setUser(user);
    return user;
  };

  const handleGetActiveRide = async (rideId: string) => {
    const ride = await getActiveRide(rideId);
    setActiveRide(ride);
    return ride;
  };

  const handleCreateDriver = async (driver: NewDriver) => {
    const newDriver = await createDriver(driver);
    setDriver(newDriver);
  };

  return (
    <Context.Provider
      value={{
        activeRide,
        setActiveRide,
        user,
        setUser,
        driver,
        setDriver,
        getUser: handleGetUser,
        getActiveRide: handleGetActiveRide,
        createDriver: handleCreateDriver,
      }}
    >
      {children}
    </Context.Provider>
  );
};
