// src/services/hotelAgentService.ts
import hotelsData from '../data/hotels.json';
import { Hotel, Room } from './hotelService';

/**
 * En este arreglo en memoria almacenaremos los hoteles
 * para simular una base de datos.
 */
const hotels: Hotel[] = hotelsData as Hotel[];

/**
 * Obtiene la lista completa de hoteles (simulado).
 */
export const getAgentHotels = async (): Promise<Hotel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...hotels]);
    }, 300);
  });
};

/**
 * Crea un nuevo hotel con los datos básicos (name, city, description).
 * Asigna un ID incremental y habilita el hotel por defecto.
 */
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

/**
 * Alterna el estado de habilitado/deshabilitado de un hotel.
 */
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

/**
 * Actualiza la información básica de un hotel (nombre, ciudad, descripción).
 */
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

/**
 * Alterna el estado de habilitado/deshabilitado de una habitación.
 */
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

/**
 * Agrega una nueva habitación a un hotel.
 */
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
