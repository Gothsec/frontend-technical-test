import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  createReservation,
  Passenger,
  EmergencyContact,
  Reservation
} from '../../services/reservationService';

const ReservationForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Datos recibidos desde la selección de habitación
  const {
    hotelId,
    roomId,
    city,
    checkIn,
    checkOut,
    persons
  } = state || {};

  // Estado para los pasajeros
  const [passengers, setPassengers] = useState<Passenger[]>(() => {
    // Inicializamos un array con la longitud de "persons"
    return Array.from({ length: persons }, () => ({
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
      documentType: '',
      documentNumber: '',
      email: '',
      phone: ''
    }));
  });

  // Estado para contacto de emergencia
  const [emergencyContact, setEmergencyContact] = useState<EmergencyContact>({
    fullName: '',
    phone: ''
  });

  // Manejo de cambios en el formulario de pasajeros
  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  // Manejo de cambios en el contacto de emergencia
  const handleEmergencyChange = (field: keyof EmergencyContact, value: string) => {
    setEmergencyContact({ ...emergencyContact, [field]: value });
  };

  // Al enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newReservation: Reservation = {
      hotelId,
      roomId,
      city,
      checkIn,
      checkOut,
      persons,
      passengers,
      emergencyContact
    };

    // Creamos la reserva (mock)
    await createReservation(newReservation);

    // Navegamos a la página de éxito
    navigate('/success');
  };

  // Si faltan datos básicos, retornamos un mensaje
  if (!hotelId || !roomId || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Faltan datos para completar la reserva. Regresa a la página anterior.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6"
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">
          Datos de la Reserva
        </h2>
        <p className="mb-6 text-gray-700">
          Hotel ID: {hotelId} | Habitación ID: {roomId}
          <br />
          Ciudad: {city}
          <br />
          Entrada: {checkIn} | Salida: {checkOut}
          <br />
          Pasajeros: {persons}
        </p>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Datos de los Huéspedes
        </h3>
        {passengers.map((passenger, index) => (
          <div key={index} className="mb-6 border-b pb-4">
            <p className="font-semibold mb-2">
              Huésped {index + 1}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">Nombres</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={passenger.firstName}
                  onChange={(e) =>
                    handlePassengerChange(index, 'firstName', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Apellidos</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={passenger.lastName}
                  onChange={(e) =>
                    handlePassengerChange(index, 'lastName', e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={passenger.birthDate}
                  onChange={(e) =>
                    handlePassengerChange(index, 'birthDate', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Género</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={passenger.gender}
                  onChange={(e) =>
                    handlePassengerChange(index, 'gender', e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">Tipo de Documento</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={passenger.documentType}
                  onChange={(e) =>
                    handlePassengerChange(index, 'documentType', e.target.value)
                  }
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="DNI">DNI</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">N° Documento</label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={passenger.documentNumber}
                  onChange={(e) =>
                    handlePassengerChange(index, 'documentNumber', e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={passenger.email}
                  onChange={(e) =>
                    handlePassengerChange(index, 'email', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  value={passenger.phone}
                  onChange={(e) =>
                    handlePassengerChange(index, 'phone', e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>
        ))}

        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Contacto de Emergencia
        </h3>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nombres Completos</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            value={emergencyContact.fullName}
            onChange={(e) => handleEmergencyChange('fullName', e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Teléfono de Contacto</label>
          <input
            type="tel"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            value={emergencyContact.phone}
            onChange={(e) => handleEmergencyChange('phone', e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Reservar
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
