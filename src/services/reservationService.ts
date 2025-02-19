export interface Passenger {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
}

export interface EmergencyContact {
  fullName: string;
  phone: string;
}

export interface Reservation {
  hotelId: number;
  roomId: number;
  checkIn: string;
  checkOut: string;
  passengers: Passenger[];
  emergencyContact: EmergencyContact;
  persons: number;
  city: string;
}

// Arreglo para almacenar las reservas (simulación)
const mockReservations: Reservation[] = [];

/**
 * Simula la obtención de las reservas existentes.
 */
export const fetchReservations = (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReservations);
    }, 300);
  });
};

/**
 * Crea una nueva reserva y la almacena en el mock.
 */
export const createReservation = (reservation: Reservation): Promise<Reservation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockReservations.push(reservation);
      resolve(reservation);
    }, 300);
  });
};
