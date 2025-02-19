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

const mockReservations: Reservation[] = [];

export const fetchReservations = (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReservations);
    }, 300);
  });
};

export const createReservation = (reservation: Reservation): Promise<Reservation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockReservations.push(reservation);
      resolve(reservation);
    }, 300);
  });
};
