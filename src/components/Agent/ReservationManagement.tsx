import { useEffect, useState } from 'react';
import { fetchReservations, Reservation } from '../../services/reservationService';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    const data = await fetchReservations();
    setReservations(data);
    setLoading(false);
  };

  const handleViewDetail = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const closeDetail = () => {
    setSelectedReservation(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Gestión de Reservas</h2>
        <p>Cargando reservas...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Gestión de Reservas</h2>
      <ul className="space-y-4">
        {reservations.map((res) => (
          <li key={res.hotelId + '-' + res.roomId + '-' + res.checkIn} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">
                  Hotel ID: {res.hotelId} | Habitación: {res.roomId}
                </p>
                <p className="text-gray-600">
                  Check In: {res.checkIn} - Check Out: {res.checkOut}
                </p>
                <p className="text-gray-600">Personas: {res.persons}</p>
              </div>
              <button
                onClick={() => handleViewDetail(res)}
                className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 transition cursor-pointer"
              >
                Ver Detalle
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedReservation && (
        <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
          <h3 className="text-xl font-bold mb-2">Detalle de la Reserva</h3>
          <p>
            <strong>Hotel ID:</strong> {selectedReservation.hotelId}
          </p>
          <p>
            <strong>Habitación ID:</strong> {selectedReservation.roomId}
          </p>
          <p>
            <strong>Ciudad:</strong> {selectedReservation.city}
          </p>
          <p>
            <strong>Check In:</strong> {selectedReservation.checkIn} |{' '}
            <strong>Check Out:</strong> {selectedReservation.checkOut}
          </p>
          <p>
            <strong>Cantidad de Personas:</strong> {selectedReservation.persons}
          </p>

          <h4 className="mt-4 font-semibold">Pasajeros:</h4>
          {selectedReservation.passengers.map((p, index) => (
            <div key={index} className="ml-4 text-sm text-gray-700">
              {p.firstName} {p.lastName} - {p.documentType}: {p.documentNumber}
            </div>
          ))}

          <h4 className="mt-4 font-semibold">Contacto de Emergencia:</h4>
          <div className="ml-4 text-sm text-gray-700">
            {selectedReservation.emergencyContact.fullName} -{' '}
            {selectedReservation.emergencyContact.phone}
          </div>

          <button
            onClick={closeDetail}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationManagement;
