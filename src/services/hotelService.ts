import hotelsData from '../data/hotels.json';

export interface Room {
id: number;
type: string;
location: string;
costBase: number;
taxes: number;
enabled: boolean;
capacity: number;
}

export interface Hotel {
  id: number;
  name: string;
  city: string;
  description: string;
  enabled: boolean;
  rooms: Room[];
}

export const fetchHotels = (): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(hotelsData as Hotel[]);
    }, 300);
  });
};
