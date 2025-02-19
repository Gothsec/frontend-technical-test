import hotelsData from '../data/hotels.json';
import { Hotel, Room } from './hotelService';

const hotels: Hotel[] = hotelsData as Hotel[];

export const getAgentHotels = async (): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...hotels]);
    }, 300);
  });
};

export const createHotel = async (
  name: string,
  city: string,
  description: string
): Promise<Hotel> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newHotel: Hotel = {
        id: hotels.length + 1,
        name,
        city,
        description,
        enabled: true,
        rooms: []
      };
      hotels.push(newHotel);
      resolve(newHotel);
    }, 300);
  });
};

export const toggleHotelEnabled = async (hotelId: number): Promise<Hotel | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = hotels.findIndex((h) => h.id === hotelId);
      if (index === -1) {
        resolve(null);
        return;
      }
      hotels[index].enabled = !hotels[index].enabled;
      resolve(hotels[index]);
    }, 300);
  });
};

export const updateHotel = async (
  hotelId: number,
  name: string,
  city: string,
  description: string
): Promise<Hotel | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = hotels.findIndex((h) => h.id === hotelId);
      if (index === -1) {
        resolve(null);
        return;
      }
      hotels[index].name = name;
      hotels[index].city = city;
      hotels[index].description = description;
      resolve(hotels[index]);
    }, 300);
  });
};

export const toggleRoomEnabled = async (hotelId: number, roomId: number): Promise<Room | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hotelIndex = hotels.findIndex((h) => h.id === hotelId);
      if (hotelIndex === -1) {
        resolve(null);
        return;
      }
      const roomIndex = hotels[hotelIndex].rooms.findIndex((r) => r.id === roomId);
      if (roomIndex === -1) {
        resolve(null);
        return;
      }
      hotels[hotelIndex].rooms[roomIndex].enabled = !hotels[hotelIndex].rooms[roomIndex].enabled;
      resolve(hotels[hotelIndex].rooms[roomIndex]);
    }, 300);
  });
};

export const addRoomToHotel = async (
  hotelId: number,
  type: string,
  location: string,
  costBase: number,
  taxes: number
): Promise<Room | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hotelIndex = hotels.findIndex((h) => h.id === hotelId);
      if (hotelIndex === -1) {
        resolve(null);
        return;
      }
      const newRoom: Room = {
        id: hotels[hotelIndex].rooms.length + 1,
        type,
        location,
        costBase,
        taxes,
        enabled: true
      };
      hotels[hotelIndex].rooms.push(newRoom);
      resolve(newRoom);
    }, 300);
  });
};

export const updateRoom = async (
  hotelId: number,
  roomId: number,
  type: string,
  location: string,
  costBase: number,
  taxes: number
): Promise<Room | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hotelIndex = hotels.findIndex((h) => h.id === hotelId);
      if (hotelIndex === -1) {
        resolve(null);
        return;
      }
      const roomIndex = hotels[hotelIndex].rooms.findIndex((r) => r.id === roomId);
      if (roomIndex === -1) {
        resolve(null);
        return;
      }
      hotels[hotelIndex].rooms[roomIndex].type = type;
      hotels[hotelIndex].rooms[roomIndex].location = location;
      hotels[hotelIndex].rooms[roomIndex].costBase = costBase;
      hotels[hotelIndex].rooms[roomIndex].taxes = taxes;
      resolve(hotels[hotelIndex].rooms[roomIndex]);
    }, 300);
  });
};
