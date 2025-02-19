import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Viajero
import HotelSearch from './components/Client/HotelSearch';
import RoomsSelection from './components/Client/RoomSelection';
import ReservationForm from './components/Client/ReservationForm';
import ReservationSuccess from './components/Client/ReservationSuccess';

// Agente
import AgentLogin from './components/Agent/AgentLogin';
import AgentDashboard from './components/Agent/AgentDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas para el viajero */}
        <Route path="/" element={<HotelSearch />} />
        <Route path="/rooms" element={<RoomsSelection />} />
        <Route path="/reservation" element={<ReservationForm />} />
        <Route path="/success" element={<ReservationSuccess />} />

        {/* Rutas para el agente */}
        <Route path="/login" element={<AgentLogin />} />
        <Route path="/dashboard" element={<AgentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
