import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHotels, Hotel } from "../../services/hotelService";

const HotelSearch = () => {
  const [city, setCity] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState<number>(1);
  const [results, setResults] = useState<Hotel[]>([]);
  const [searched, setSearched] = useState(false);
  const [dateError, setDateError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCities = async () => {
      const hotels = await fetchHotels();
      const uniqueCities = [
        ...new Set(hotels.map((hotel: Hotel) => hotel.city)),
      ];
      setCities(uniqueCities);
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

    const parseLocalDate = (dateString: string) => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    const checkInDate = parseLocalDate(inDate);
    const checkOutDate = parseLocalDate(outDate);

    if (checkInDate < today) {
      setDateError("La fecha de entrada no puede ser en el pasado");
      return false;
    }

    if (checkOutDate <= checkInDate) {
      setDateError(
        "La fecha de salida debe ser posterior a la fecha de entrada"
      );
      return false;
    }

    setDateError("");
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
        setCheckOut(newCheckOutDate.toISOString().split("T")[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateDates(checkIn, checkOut)) {
      return;
    }

    setIsLoading(true);

    try {
      const hotels = await fetchHotels();
      const filtered = hotels.filter((hotel: Hotel) => hotel.city === city);
      setResults(filtered);
      setSearched(true);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHotel = (hotelId: number) => {
    navigate(`/rooms`, {
      state: { hotelId, city, checkIn, checkOut, persons },
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Hotel App</h1>
          <button
            onClick={() => navigate("/login")}
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
              <label
                htmlFor="city"
                className="block text-gray-700 font-medium mb-2"
              >
                Ciudad de destino
              </label>
              <div className="relative">
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map((cityOption) => (
                    <option key={cityOption} value={cityOption}>
                      {cityOption}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkIn"
                  className="block text-gray-700 font-medium mb-2"
                >
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
                <label
                  htmlFor="checkOut"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Fecha de salida
                </label>
                <input
                  type="date"
                  id="checkOut"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={
                    checkIn
                      ? new Date(new Date(checkIn).getTime() + 86400000)
                          .toISOString()
                          .split("T")[0]
                      : today
                  }
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
              <label
                htmlFor="persons"
                className="block text-gray-700 font-medium mb-2"
              >
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
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition cursor-pointer flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Buscando...
                </>
              ) : (
                "Buscar Hoteles"
              )}
            </button>
          </form>

          <div className="w-full max-w-4xl mt-10" ref={resultsRef}>
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 border-t-indigo-500 animate-spin"></div>
                <p className="ml-4 text-lg font-semibold text-indigo-600">
                  Buscando hoteles...
                </p>
              </div>
            ) : (
              <>
                {searched && results.length > 0 && (
                  <div className="transition-all duration-300 ease-in-out">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 border-indigo-100">
                      Resultados de búsqueda
                    </h3>
                    <div
                      className="overflow-y-auto max-h-[500px] pr-2 scroll-smooth"
                      style={{ scrollBehavior: "smooth" }}
                    >
                      <ul className="space-y-6">
                        {results.map((hotel: Hotel) => (
                          <li
                            key={hotel.id}
                            className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                          >
                            <div className="flex flex-col sm:flex-row justify-between">
                              <div className="flex-grow">
                                <h4 className="text-xl font-bold text-indigo-600 mb-2">
                                  {hotel.name}
                                </h4>
                                <div className="flex items-center mb-3 text-yellow-500">
                                  <span className="text-sm text-gray-500">
                                    Ciudad: {hotel.city}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-4">
                                  {hotel.description}
                                </p>
                              </div>
                              <div className="flex flex-col justify-between items-end mt-4 sm:mt-0">
                                <button
                                  onClick={() => handleSelectHotel(hotel.id)}
                                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300 cursor-pointer flex items-center"
                                >
                                  Ver Habitaciones
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 ml-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {searched && results.length === 0 && (
                  <div className="p-8 text-center bg-gray-50 rounded-lg shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-gray-700 text-lg">
                      No se encontraron hoteles en{" "}
                      <span className="font-semibold">"{city}"</span>
                    </p>
                    <p className="text-gray-500 mt-2">
                      Por favor, intenta con otra ciudad o fechas diferentes.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelSearch;
