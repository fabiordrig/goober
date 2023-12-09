import { NewUser, Ride, User } from "./types";

export const getRider = async (id: string): Promise<Ride> => {
  const response = await fetch(`/api/rider/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
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

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
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


  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const result = await response.json();

  return result;
}
