import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const generateUUID = () => uuidv4();



const DEFAULT_THROTTLING_TIME_MS = 800;

/**
 * The purpose of this hook is to provide a way to reduce the number of
 * requests for a costly operation (like saving a document in the API). This
 * is achieved by delaying the request by a throttling time `T`. If no request
 * is made during `T`, the callback can be executed, otherwise, for each request
 * during `T`, the previous callback execution is canceled, and the delay to the
 * subsequent execution is reset.
 *
 * Usage with inputs example:
 * ```
 *  <Input
 *    onChange={
 *      (e) => debouncer.setCallback(() => costlySaveOperation(e.target?.value))
 *    }
 *  />
 * ```
 *
 *  In this example, the `costlySaveOperation` will be executed only after the
 *  user stops typing.
 *
 * @param throttlingTimeMs minimum period of time to delay the request.
 * @returns Debouncer methods.
 */
export const useDebouncer = (throttlingTimeMs = DEFAULT_THROTTLING_TIME_MS) => {
  const [delay, setDelay] = useState<(number | null)>(null);

  const setCallback = (callback: () => (Promise<void> | void)) => {
    if (delay !== null) {
      clearTimeout(delay);
    }

    const newDelay = setTimeout(
      async () => {
        await callback();
        setDelay(null);
      },
      throttlingTimeMs,
    ) as unknown as number;

    // This is necessary because `setDelay` has some performance
    // issues when the page have a lot of states, using `setTimeout`
    // with zero milliseconds will prevent the `setDelay` from blocking
    // the `setCallback` execution.
    setTimeout(() => setDelay((prevDelay) => {
      if (prevDelay !== null) clearTimeout(prevDelay);

      return newDelay;
    }), 0);
  };

  return ({ setCallback });
};


export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);


  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const calculateFare = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= 3 ? 10 : distance * 3.5;
}


export const calculateETA = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  const speed = 60;
  const time = distance / speed;
  const hours = Math.floor(time);
  const minutes = Math.floor((time - hours) * 60);
  return minutes;
}
