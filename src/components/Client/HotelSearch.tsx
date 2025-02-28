import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHotels, Hotel } from '../../services/hotelService';

const HotelSearch = () => {
const [city, setCity] = useState('');
const [cities, setCities] = useState<string[]>([]);
const [checkIn, setCheckIn] = useState('');
const [checkOut, setCheckOut] = useState('');
const [persons, setPersons] = useState<number>(1);
const [results, setResults] = useState<Hotel[]>([]);
const [searched, setSearched] = useState(false);
const [dateError, setDateError] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    if (!checkIn) {
      setCheckIn(formatDate(today));
    }
    if (!checkOut) {
      setCheckOut(formatDate(tomorrow));
    }
}, []);

useEffect(() => {
const loadCities = async () => {
    const hotels = await fetchHotels();
    const uniqueCities = [...new Set(hotels.map((hotel: Hotel) => hotel.city))];
    setCities(uniqueCities);
    if (uniqueCities.length > 0 && !city) {
    setCity(uniqueCities[0]);
    }
};
loadCities();
}, []);

useEffect(() => {
if (checkIn && checkOut) {
    validateDates(checkIn, checkOut);
}
}, [checkIn, checkOut]);

  const validateDates = (inDate: string, outDate: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkInDate = new Date(inDate);
    const checkOutDate = new Date(outDate);
    
    if (checkInDate < today) {
      setDateError('La fecha de entrada no puede ser en el pasado');
      return false;
    }
    
    if (checkOutDate <= checkInDate) {
      setDateError('La fecha de salida debe ser posterior a la fecha de entrada');
      return false;
    }
    
    setDateError('');
    return true;
  };

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    
    if (checkOut) {
      const checkInDate = new Date(newCheckIn);
      const checkOutDate = new Date(checkOut);
      
      if (checkOutDate <= checkInDate) {
        const newCheckOutDate = new Date(checkInDate);
        newCheckOutDate.setDate(newCheckOutDate.getDate() + 1);
        setCheckOut(newCheckOutDate.toISOString().split('T')[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDates(checkIn, checkOut)) {
      return;
    }
    
    const hotels = await fetchHotels();
    const filtered = hotels.filter((hotel: Hotel) =>
    hotel.city === city
    );
    setResults(filtered);
    setSearched(true);
  };

  const handleSelectHotel = (hotelId: number) => {
    navigate(`/rooms`, {
      state: { hotelId, city, checkIn, checkOut, persons },
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Hotel App</h1>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition cursor-pointer"
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
            className="bg-white shadow-md rounded-xl p-8 w-full max-w-lg"
          >
            <div className="mb-6">
              <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
                Ciudad de destino
              </label>
            <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            >
            {cities.map((cityOption) => (
                <option key={cityOption} value={cityOption}>
                {cityOption}
                </option>
            ))}
            </select>
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
                  onChange={handleCheckInChange}
                  min={today}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : today}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            {dateError && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
                {dateError}
              </div>
            )}
            <div className="mb-6">
              <label htmlFor="persons" className="block text-gray-700 font-medium mb-2">
                Cantidad de personas
              </label>
              <input
                type="number"
                id="persons"
                value={persons}
                onChange={(e) => setPersons(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                min={1}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
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
                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition cursor-pointer"
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