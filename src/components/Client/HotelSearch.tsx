import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHotels, Hotel } from '../../services/hotelService';

const HotelSearch: React.FC = () => {
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [persons, setPersons] = useState<number>(1);
  const [results, setResults] = useState<Hotel[]>([]);
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hotels = await fetchHotels();
    // Filtramos por ciudad
    const filtered = hotels.filter((hotel: Hotel) =>
      hotel.city.toLowerCase().includes(city.trim().toLowerCase())
    );
    setResults(filtered);
    setSearched(true);
  };

  const handleSelectHotel = (hotelId: number) => {
    // Navegamos a la selección de habitación, pasando datos vía state
    navigate(`/rooms`, {
      state: { hotelId, city, checkIn, checkOut, persons },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Hotel App</h1>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Iniciar Sesión como Agente
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Encuentra tu Hotel Ideal
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg"
          >
            <div className="mb-6">
              <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
                Ciudad de destino
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ingresa la ciudad"
                required
              />
            </div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkIn" className="block text-gray-700 font-medium mb-2">
                  Fecha de entrada
                </label>
                <input
                  type="date"
                  id="checkIn"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="checkOut" className="block text-gray-700 font-medium mb-2">
                  Fecha de salida
                </label>
                <input
                  type="date"
                  id="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="persons" className="block text-gray-700 font-medium mb-2">
                Cantidad de personas
              </label>
              <input
                type="number"
                id="persons"
                value={persons}
                onChange={(e) => setPersons(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={1}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded hover:bg-indigo-700 transition"
            >
              Buscar Hoteles
            </button>
          </form>

          <div className="w-full max-w-lg mt-10">
            {searched && results.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Resultados</h3>
                <ul>
                  {results.map((hotel: Hotel) => (
                    <li key={hotel.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                      <h4 className="text-xl font-bold text-indigo-600 mb-2">{hotel.name}</h4>
                      <p className="text-gray-700 mb-4">{hotel.description}</p>
                      <button
                        onClick={() => handleSelectHotel(hotel.id)}
                        className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
                      >
                        Ver Habitaciones
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {searched && results.length === 0 && (
              <p className="text-gray-700 text-center">
                No se encontraron hoteles en "{city}"
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelSearch;
