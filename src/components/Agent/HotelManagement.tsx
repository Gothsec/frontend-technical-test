import { useEffect, useState } from "react";
import { Hotel } from "../../services/hotelService";
import {
  getAgentHotels,
  createHotel,
  toggleHotelEnabled,
  toggleRoomEnabled,
  addRoomToHotel,
  updateHotel,
  updateRoom,
} from "../../services/hotelAgentService";

const HotelManagement = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const [newHotelName, setNewHotelName] = useState("");
  const [newHotelCity, setNewHotelCity] = useState("");
  const [newHotelDescription, setNewHotelDescription] = useState("");

  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
  const [roomType, setRoomType] = useState("");
  const [roomLocation, setRoomLocation] = useState("");
  const [roomCostBase, setRoomCostBase] = useState<number>(0);
  const [roomTaxes, setRoomTaxes] = useState<number>(0);

  const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
  const [editHotelName, setEditHotelName] = useState("");
  const [editHotelCity, setEditHotelCity] = useState("");
  const [editHotelDescription, setEditHotelDescription] = useState("");

  const [editingRoom, setEditingRoom] = useState<{
    hotelId: number;
    roomId: number;
  } | null>(null);
  const [editRoomType, setEditRoomType] = useState("");
  const [editRoomLocation, setEditRoomLocation] = useState("");
  const [editRoomCostBase, setEditRoomCostBase] = useState<number>(0);
  const [editRoomTaxes, setEditRoomTaxes] = useState<number>(0);

  const loadHotels = async () => {
    try {
      setLoading(true);
      const data = await getAgentHotels();
      setHotels(data);
    } catch (error) {
      console.error("Error al cargar hoteles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName || !newHotelCity) return;
    try {
      await createHotel(newHotelName, newHotelCity, newHotelDescription);

      setNewHotelName("");
      setNewHotelCity("");
      setNewHotelDescription("");
      loadHotels();
    } catch (error) {
      console.error("Error al crear hotel:", error);
    }
  };

  const handleEditHotelClick = (
    hotelId: number,
    name: string,
    city: string,
    description: string
  ) => {
    setEditingHotelId(hotelId);
    setEditHotelName(name);
    setEditHotelCity(city);
    setEditHotelDescription(description);
  };

  const handleCancelEditHotel = () => {
    setEditingHotelId(null);
    setEditHotelName("");
    setEditHotelCity("");
    setEditHotelDescription("");
  };

  const handleSaveHotel = async (hotelId: number) => {
    try {
      await updateHotel(
        hotelId,
        editHotelName,
        editHotelCity,
        editHotelDescription
      );
      setEditingHotelId(null);
      loadHotels();
    } catch (error) {
      console.error("Error al actualizar hotel:", error);
    }
  };

  const handleToggleHotel = async (hotelId: number) => {
    try {
      await toggleHotelEnabled(hotelId);
      loadHotels();
    } catch (error) {
      console.error("Error al alternar estado del hotel:", error);
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId) return;
    try {
      await addRoomToHotel(
        selectedHotelId,
        roomType,
        roomLocation,
        roomCostBase,
        roomTaxes,
        0
      );

      setSelectedHotelId(null);
      setRoomType("");
      setRoomLocation("");
      setRoomCostBase(0);
      setRoomTaxes(0);
      loadHotels();
    } catch (error) {
      console.error("Error al agregar habitación:", error);
    }
  };

  const handleEditRoomClick = (
    hotelId: number,
    roomId: number,
    type: string,
    location: string,
    costBase: number,
    taxes: number
  ) => {
    setEditingRoom({ hotelId, roomId });
    setEditRoomType(type);
    setEditRoomLocation(location);
    setEditRoomCostBase(costBase);
    setEditRoomTaxes(taxes);
  };

  const handleCancelEditRoom = () => {
    setEditingRoom(null);
    setEditRoomType("");
    setEditRoomLocation("");
    setEditRoomCostBase(0);
    setEditRoomTaxes(0);
  };

  const handleSaveRoom = async (hotelId: number, roomId: number) => {
    try {
      await updateRoom(
        hotelId,
        roomId,
        editRoomType,
        editRoomLocation,
        editRoomCostBase,
        editRoomTaxes,
        0
      );
      setEditingRoom(null);
      loadHotels();
    } catch (error) {
      console.error("Error al actualizar habitación:", error);
    }
  };

  const handleToggleRoom = async (hotelId: number, roomId: number) => {
    try {
      await toggleRoomEnabled(hotelId, roomId);
      loadHotels();
    } catch (error) {
      console.error("Error al alternar estado de la habitación:", error);
    }
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
      <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
        Gestión de Hoteles
      </h2>
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
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition cursor-pointer"
        >
          Agregar Hotel
        </button>
      </form>

      <ul className="space-y-4">
        {hotels.map((hotel) => (
          <li key={hotel.id} className="border-b pb-4">
            {editingHotelId === hotel.id ? (
              <div className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    value={editHotelName}
                    onChange={(e) => setEditHotelName(e.target.value)}
                    placeholder="Nombre del hotel"
                    className="border rounded-lg px-3 py-2 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    value={editHotelCity}
                    onChange={(e) => setEditHotelCity(e.target.value)}
                    placeholder="Ciudad"
                    className="border rounded-lg px-3 py-2 focus:outline-none"
                    required
                  />
                </div>
                <textarea
                  value={editHotelDescription}
                  onChange={(e) => setEditHotelDescription(e.target.value)}
                  placeholder="Descripción del hotel"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none mb-4"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveHotel(hotel.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition cursor-pointer"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelEditHotel}
                    className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-xl font-bold text-indigo-700">
                    {hotel.name}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {hotel.city} | {hotel.description}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() =>
                      handleEditHotelClick(
                        hotel.id,
                        hotel.name,
                        hotel.city,
                        hotel.description
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleHotel(hotel.id)}
                    className={`px-3 py-1 rounded-lg text-white ${
                      hotel.enabled
                        ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                        : "bg-red-500 hover:bg-red-600 cursor-pointer"
                    }`}
                  >
                    {hotel.enabled ? "Habilitado" : "Deshabilitado"}
                  </button>
                </div>
              </div>
            )}

            {hotel.rooms && hotel.rooms.length > 0 && (
              <div className="ml-4 mt-2">
                <h5 className="font-semibold mb-2">Habitaciones:</h5>
                <ul>
                  {hotel.rooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex justify-between items-center mb-2"
                    >
                      {editingRoom &&
                      editingRoom.hotelId === hotel.id &&
                      editingRoom.roomId === room.id ? (
                        <div className="flex-grow mr-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                            <input
                              type="text"
                              value={editRoomType}
                              onChange={(e) => setEditRoomType(e.target.value)}
                              placeholder="Tipo"
                              className="border rounded-lg px-2 py-1 focus:outline-none"
                              required
                            />
                            <input
                              type="text"
                              value={editRoomLocation}
                              onChange={(e) =>
                                setEditRoomLocation(e.target.value)
                              }
                              placeholder="Ubicación"
                              className="border rounded-lg px-2 py-1 focus:outline-none"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={editRoomCostBase}
                              onChange={(e) =>
                                setEditRoomCostBase(Number(e.target.value))
                              }
                              placeholder="Costo Base (en COP)"
                              className="border rounded-lg px-2 py-1 focus:outline-none"
                              required
                            />
                            <input
                              type="number"
                              value={editRoomTaxes}
                              onChange={(e) =>
                                setEditRoomTaxes(Number(e.target.value))
                              }
                              placeholder="Impuestos (en COP)"
                              className="border rounded-lg px-2 py-1 focus:outline-none"
                              required
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mr-2">
                          <span className="font-medium">
                            {room.type} - {room.location}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            (Base: ${room.costBase} COP, Imp: ${room.taxes} COP)
                          </span>
                        </div>
                      )}

                      {editingRoom &&
                      editingRoom.hotelId === hotel.id &&
                      editingRoom.roomId === room.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleSaveRoom(hotel.id, room.id)}
                            className="bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 transition text-sm cursor-pointer"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancelEditRoom}
                            className="bg-gray-300 text-black px-2 py-1 rounded-lg hover:bg-gray-400 transition text-sm cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() =>
                              handleEditRoomClick(
                                hotel.id,
                                room.id,
                                room.type,
                                room.location,
                                room.costBase,
                                room.taxes
                              )
                            }
                            className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600 transition text-sm cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleRoom(hotel.id, room.id)}
                            className={`px-2 py-1 rounded-lg text-white text-sm ${
                              room.enabled
                                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                                : "bg-red-500 hover:bg-red-600 cursor-pointer"
                            }`}
                          >
                            {room.enabled ? "Habilitada" : "Deshabilitada"}
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Agregar Habitación</h3>
        <form onSubmit={handleAddRoom}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Hotel</label>
            <select
              value={selectedHotelId ?? ""}
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
            <div>
              <label className="block text-sm font-semibold mb-1">
                Tipo de habitación
              </label>
              <input
                type="text"
                placeholder="Tipo de habitación (Sencilla, Doble, etc.)"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Ubicación
              </label>
              <input
                type="text"
                placeholder="Ubicación (Planta Baja, etc.)"
                value={roomLocation}
                onChange={(e) => setRoomLocation(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none w-full"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Costo Base
              </label>
              <input
                type="number"
                placeholder="Costo Base (en COP)"
                value={roomCostBase}
                onChange={(e) => setRoomCostBase(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 focus:outline-none w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Impuestos
              </label>
              <input
                type="number"
                placeholder="Impuestos (en COP)"
                value={roomTaxes}
                onChange={(e) => setRoomTaxes(Number(e.target.value))}
                className="border rounded-lg px-3 py-2 focus:outline-none w-full"
                required
              />
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Los valores deben ingresarse en Pesos Colombianos (COP)
          </p>
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition cursor-pointer"
          >
            Agregar Habitación
          </button>
        </form>
      </div>
    </div>
  );
};

export default HotelManagement;
