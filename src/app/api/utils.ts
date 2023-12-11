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
