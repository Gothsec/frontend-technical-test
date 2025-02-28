import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchHotels, Hotel, Room } from '../../services/hotelService';

const RoomsSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId, city, checkIn, checkOut, persons } = location.state || {};

  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const loadHotel = async () => {
      const hotels = await fetchHotels();
      const selected = hotels.find((h) => h.id === hotelId);
      setHotel(selected || null);
    };
    loadHotel();
  }, [hotelId]);

  const handleReserve = (room: Room) => {
    navigate('/reservation', {
      state: {
        hotelId,
        roomId: room.id,
        city,
        checkIn,
        checkOut,
        persons,
      },
    });
  };

  if (!hotel) {
    return <p className="text-center mt-10">Cargando hotel...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">
          {hotel.name}
        </h2>
        <p className="text-gray-700 mb-4">{hotel.description}</p>
        <h3 className="text-xl font-semibold mb-2">Habitaciones disponibles:</h3>
        {hotel.rooms.filter(room => room.capacity >= persons).length === 0 ? (
        <p className="text-red-500 mb-4">
            No hay habitaciones disponibles para {persons} {persons === 1 ? 'persona' : 'personas'}.
        </p>
        ) : (
        <ul>
        {hotel.rooms
        .filter((room) => room.capacity >= persons)
        .map((room) => (
            <li key={room.id} className="mb-4 p-4 border rounded-lg">
              <p className="font-bold">
                {room.type} - {room.location}
            </p>
            <p className="text-gray-600">Capacidad: {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}</p>
            <p className="text-gray-600">Costo base: ${room.costBase}</p>
              <p className="text-gray-600">Impuestos: ${room.taxes}</p>
              <button
                onClick={() => handleReserve(room)}
                className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition cursor-pointer"
              >
                Reservar
              </button>
            </li>
        ))}
    </ul>
    )}
      </div>
    </div>
  );
};

export default RoomsSelection;
