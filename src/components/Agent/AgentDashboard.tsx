import HotelManagement from "./HotelManagement";
import ReservationManagement from "./ReservationManagement";

const AgentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">
        Dashboard del Agente
      </h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <HotelManagement />
        <ReservationManagement />
      </div>
    </div>
  );
};

export default AgentDashboard;
