// src/components/Agent/HotelManagement.tsx
import React, { useEffect, useState } from 'react';
import { Hotel, Room } from '../../services/hotelService';
import {
  getAgentHotels,
  createHotel,
  toggleHotelEnabled,
  updateHotel,
  toggleRoomEnabled,
  addRoomToHotel
} from '../../services/hotelAgentService';

const HotelManagement: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para crear un nuevo hotel
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelCity, setNewHotelCity] = useState('');
  const [newHotelDescription, setNewHotelDescription] = useState('');

  // Estados para agregar habitación
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [roomType, setRoomType] = useState('');
  const [roomLocation, setRoomLocation] = useState('');
  const [roomCostBase, setRoomCostBase] = useState<number>(0);
  const [roomTaxes, setRoomTaxes] = useState<number>(0);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    const data = await getAgentHotels();
    setHotels(data);
    setLoading(false);
  };

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName || !newHotelCity) return;
    await createHotel(newHotelName, newHotelCity, newHotelDescription);
    setNewHotelName('');
    setNewHotelCity('');
    setNewHotelDescription('');
    loadHotels();
  };

  const handleToggleHotel = async (hotelId: number) => {
    await toggleHotelEnabled(hotelId);
    loadHotels();
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId) return;
    await addRoomToHotel(
      selectedHotelId,
      roomType,
      roomLocation,
      roomCostBase,
      roomTaxes
    );
    // Limpiamos estados
    setSelectedHotelId(null);
    setRoomType('');
    setRoomLocation('');
    setRoomCostBase(0);
    setRoomTaxes(0);
    loadHotels();
  };

  const handleToggleRoom = async (hotelId: number, roomId: number) => {
    await toggleRoomEnabled(hotelId, roomId);
    loadHotels();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-2xl font-semibold mb-4">Gestión de Hoteles</h2>
        <p>Cargando hoteles...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Gestión de Hoteles</h2>
      
      {/* Formulario para crear un nuevo hotel */}
      <form onSubmit={handleCreateHotel} className="mb-6 border-b pb-4">
        <h3 className="text-xl font-bold mb-2">Crear Nuevo Hotel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={newHotelName}
            onChange={(e) => setNewHotelName(e.target.value)}
            placeholder="Nombre del hotel"
            className="border rounded-lg px-3 py-2 focus:outline-none"
            required
          />
          <input
            type="text"
            value={newHotelCity}
            onChange={(e) => setNewHotelCity(e.target.value)}
            placeholder="Ciudad"
            className="border rounded-lg px-3 py-2 focus:outline-none"
            required
          />
        </div>
        <textarea
          value={newHotelDescription}
          onChange={(e) => setNewHotelDescription(e.target.value)}
          placeholder="Descripción del hotel"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none mb-4"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Agregar Hotel
        </button>
      </form>

      {/* Listado de hoteles */}
      <ul className="space-y-4">
        {hotels.map((hotel) => (
          <li key={hotel.id} className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="text-xl font-bold text-indigo-700">{hotel.name}</h4>
                <p className="text-gray-700 text-sm">
                  {hotel.city} | {hotel.description}
                </p>
              </div>
              <button
                onClick={() => handleToggleHotel(hotel.id)}
                className={`px-3 py-1 rounded-lg text-white ${
                  hotel.enabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {hotel.enabled ? 'Habilitado' : 'Deshabilitado'}
              </button>
            </div>
            {/* Habitaciones */}
            {hotel.rooms && hotel.rooms.length > 0 && (
              <div className="ml-4 mt-2">
                <h5 className="font-semibold mb-2">Habitaciones:</h5>
                <ul>
                  {hotel.rooms.map((room) => (
                    <li key={room.id} className="flex justify-between items-center mb-2">
                      <div>
                        <span className="font-medium">
                          {room.type} - {room.location}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          (Base: {room.costBase}€, Imp: {room.taxes}€)
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleRoom(hotel.id, room.id)}
                        className={`px-2 py-1 rounded-lg text-white text-sm ${
                          room.enabled
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-red-500 hover:bg-red-600'
                        }`}
                      >
                        {room.enabled ? 'Habilitada' : 'Deshabilitada'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Formulario para agregar una habitación a un hotel */}
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Agregar Habitación</h3>
        <form onSubmit={handleAddRoom}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Hotel</label>
            <select
              value={selectedHotelId ?? ''}
              onChange={(e) => setSelectedHotelId(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none"
              required
            >
              <option value="">Selecciona un hotel</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Tipo de habitación (Sencilla, Doble, etc.)"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Ubicación (Planta Baja, etc.)"
              value={roomLocation}
              onChange={(e) => setRoomLocation(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="number"
              placeholder="Costo Base"
              value={roomCostBase}
              onChange={(e) => setRoomCostBase(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Impuestos"
              value={roomTaxes}
              onChange={(e) => setRoomTaxes(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Agregar Habitación
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelManagement;
